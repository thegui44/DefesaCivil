<?php
header('Content-Type: application/json; charset=utf-8');

$url = "https://apiprevmet3.inmet.gov.br/avisos/rss";
$regiaoAlvo = "Noroeste Paranaense";
$cidadeAlvo = "Floraí";

$options = [
    "http" => [
        "method" => "GET",
        "header" => "User-Agent: DefesaCivil-Florai-FiltroEstrito/4.0\r\n" .
                    "Accept-Encoding: gzip, deflate\r\n"
    ]
];
$context = stream_context_create($options);
$rssContent = @file_get_contents($url, false, $context);

if ($rssContent === false) {
    echo json_encode(['status' => 'normal', 'message' => 'Não há avisos emergenciais para o Noroeste Paranaense neste momento.']);
    exit;
}

if (substr($rssContent, 0, 3) === "\x1f\x8b\x08") {
    $rssContent = gzdecode($rssContent);
}

$rssContent = trim($rssContent);

libxml_use_internal_errors(true);
$xml = simplexml_load_string($rssContent);

if ($xml === false) {
    libxml_clear_errors();
    echo json_encode(['status' => 'normal', 'message' => 'Não há avisos emergenciais para o Noroeste Paranaense neste momento.']);
    exit;
}

$alertasAtivos = [];
$alertasFuturos = [];
$alertasJaAdicionados = []; // ← Armazena alertas já incluídos (para deduplicação)
$dataAtual = new DateTime('now', new DateTimeZone('America/Sao_Paulo'));

// ============================================
// FUNÇÃO PARA EXTRAIR VALOR DO HTML
// ============================================
function extrairValor($html, $label) {
    $patterns = [
        '/' . preg_quote($label, '/') . '<\/[^>]+><td>(.*?)<\/td>/i',
        '/' . preg_quote($label, '/') . '<\/td><td>(.*?)<\/td>/i'
    ];
    
    foreach ($patterns as $pattern) {
        preg_match($pattern, $html, $match);
        if (isset($match[1]) && trim($match[1]) !== '') {
            return trim($match[1]);
        }
    }
    return '';
}

// ============================================
// FUNÇÃO PARA PARSEAR DATA DO RSS
// ============================================
function parseDataRSS($dataStr) {
    if (empty($dataStr)) return false;
    
    // Remove .0 do final
    $dataStr = preg_replace('/\.0$/', '', $dataStr);
    $dataStr = trim($dataStr);
    
    $formatos = ['Y-m-d H:i:s', 'Y-m-d H:i', 'Y-m-d'];
    foreach ($formatos as $formato) {
        $data = DateTime::createFromFormat($formato, $dataStr);
        if ($data !== false) {
            return $data;
        }
    }
    return false;
}

// ============================================
// FUNÇÃO PARA CLASSIFICAR ALERTA
// ============================================
function classificarAlerta($inicio, $fim, $dataAtual) {
    // Se não tem datas, considera ativo
    if (empty($inicio) && empty($fim)) {
        return 'ativo';
    }
    
    $dataInicio = parseDataRSS($inicio);
    $dataFim = parseDataRSS($fim);
    
    // CASO 1: Tem data de fim e já passou
    if ($dataFim !== false && $dataFim < $dataAtual) {
        return 'expirado';
    }
    
    // CASO 2: Tem data de início e ainda não começou
    if ($dataInicio !== false && $dataInicio > $dataAtual) {
        return 'futuro';
    }
    
    // CASO 3: Está em andamento
    return 'ativo';
}

// ============================================
// FUNÇÃO PARA VERIFICAR SOBREPOSIÇÃO DE PERÍODO
// ============================================
/**
 * Verifica se o alerta atual é duplicata de algum já adicionado.
 * Dois alertas são considerados duplicados quando:
 *   - Título (evento) é igual (case-insensitive)
 *   - Severidade é igual (case-insensitive)
 *   - Os períodos se sobrepõem (ou são idênticos)
 * 
 * @param string $titulo      Título do alerta atual
 * @param string $severidade  Severidade do alerta atual
 * @param string $inicio      Data de início (string) do alerta atual
 * @param string $fim         Data de fim (string) do alerta atual
 * @param array  $jaAdicionados Array de alertas já adicionados
 * @return bool               true se for duplicata, false caso contrário
 */
function ehAlertaDuplicado($titulo, $severidade, $inicio, $fim, $jaAdicionados) {
    $dataInicio = parseDataRSS($inicio);
    $dataFim = parseDataRSS($fim);
    
    foreach ($jaAdicionados as $alertaExistente) {
        // Compara título (case-insensitive)
        $mesmoTitulo = strcasecmp(
            trim($alertaExistente['titulo']), 
            trim($titulo)
        ) === 0;
        
        if (!$mesmoTitulo) continue;
        
        // Compara severidade (case-insensitive)
        $mesmaSeveridade = strcasecmp(
            trim($alertaExistente['severidade']), 
            trim($severidade)
        ) === 0;
        
        if (!$mesmaSeveridade) continue;
        
        $inicioExistente = parseDataRSS($alertaExistente['inicio']);
        $fimExistente = parseDataRSS($alertaExistente['fim']);
        
        // CASO 1: Ambos têm período completo → verifica sobreposição
        if ($dataInicio && $dataFim && $inicioExistente && $fimExistente) {
            // Sobreposição: início de um <= fim do outro E fim de um >= início do outro
            $sobrepoe = ($dataInicio <= $fimExistente) && ($dataFim >= $inicioExistente);
            
            if ($sobrepoe) {
                return true;
            }
        }
        // CASO 2: Ambos sem período → considera duplicata
        elseif (!$dataInicio && !$dataFim && !$inicioExistente && !$fimExistente) {
            return true;
        }
        // CASO 3: Um tem período, o outro não → considera duplicata
        // (mesmo título + mesma severidade, um sem data = mesma ocorrência)
        elseif ((!$dataInicio && !$dataFim) || (!$inicioExistente && !$fimExistente)) {
            return true;
        }
    }
    
    return false;
}

// ============================================
// PERCORRE TODOS OS ALERTAS
// ============================================
foreach ($xml->channel->item as $item) {
    $titulo = (string) $item->title;
    $descricaoHtml = (string) $item->description;
    
    $afetaNoroeste = (stripos($descricaoHtml, $regiaoAlvo) !== false || 
                      stripos($descricaoHtml, $cidadeAlvo) !== false);
    
    if ($afetaNoroeste) {
        $inicio = extrairValor($descricaoHtml, 'Início');
        $fim = extrairValor($descricaoHtml, 'Fim');
        $severidade = extrairValor($descricaoHtml, 'Severidade');
        $descricao = extrairValor($descricaoHtml, 'Descrição');
        
        if (empty($descricao)) {
            preg_match('/Descrição[^>]*>(.*?)</i', $descricaoHtml, $matchDesc);
            if (isset($matchDesc[1])) {
                $descricao = trim($matchDesc[1]);
            }
        }
        
        if (empty($descricao)) {
            $descricao = 'Atenção às atualizações meteorológicas.';
        }
        
        $descricao = preg_replace('/^INMET publica aviso iniciando em: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}\.?\s*/i', '', $descricao);
        $descricao = trim($descricao);
        
        preg_match('/Aviso de (.*?)\. Severidade/i', $titulo, $matchEvento);
        $evento = isset($matchEvento[1]) ? trim($matchEvento[1]) : $titulo;
        
        // ============================================
        // CLASSIFICA O ALERTA
        // ============================================
        $status = classificarAlerta($inicio, $fim, $dataAtual);
        
        // Ignora alertas expirados
        if ($status === 'expirado') {
            continue;
        }
        
        // ============================================
        // DEDUPLICAÇÃO POR SOBREPOSIÇÃO DE PERÍODO
        // ============================================
        // Se já existe um alerta com mesmo título + severidade
        // cujo período se sobrepõe ao atual, pula este.
        if (ehAlertaDuplicado($evento, $severidade, $inicio, $fim, $alertasJaAdicionados)) {
            continue;
        }
        
        // Registra este alerta como já adicionado
        $alertasJaAdicionados[] = [
            'titulo' => $evento,
            'severidade' => $severidade,
            'inicio' => $inicio,
            'fim' => $fim
        ];
        
        // Calcula peso
        $peso = 1;
        if (stripos($severidade, 'Grande Perigo') !== false) {
            $peso = 3;
        } elseif (stripos($severidade, 'Perigo') !== false) {
            $peso = 2;
        }
        
        $alerta = [
            'titulo' => $evento,
            'descricao' => $descricao,
            'severidade' => $severidade ?: 'Perigo Potencial',
            'inicio' => $inicio,
            'fim' => $fim,
            'peso' => $peso,
            'status' => $status
        ];
        
        // Adiciona à lista correta
        if ($status === 'ativo') {
            $alertasAtivos[] = $alerta;
        } else {
            $alertasFuturos[] = $alerta;
        }
    }
}

// ============================================
// ORDENAÇÃO: POR DATA (mais próxima primeiro)
// ============================================
function ordenarPorData($a, $b) {
    $dataA = parseDataRSS($a['inicio']);
    $dataB = parseDataRSS($b['inicio']);
    
    if ($dataA && $dataB) {
        $diff = $dataA->getTimestamp() - $dataB->getTimestamp();
        if ($diff != 0) {
            return $diff;
        }
    }
    
    if ($a['peso'] != $b['peso']) {
        return $b['peso'] - $a['peso'];
    }
    
    return 0;
}

usort($alertasAtivos, 'ordenarPorData');
usort($alertasFuturos, 'ordenarPorData');

// ============================================
// RETORNA TODOS OS ALERTAS
// ============================================
// SÓ MOSTRA ALERTA PRINCIPAL SE HOUVER ALERTAS ATIVOS
// Se só houver futuros, mostra "Sem Alertas Ativos" mas mantém os futuros no modal
if (count($alertasAtivos) > 0) {
    // Tem alertas ativos - exibe normalmente
    $todosAlertas = array_merge($alertasAtivos, $alertasFuturos);
    $alertaPrincipal = $todosAlertas[0];
    $outrosAlertas = array_slice($todosAlertas, 1);
    
    $level = 'warning';
    $emoji = 'alerta.svg';
    
    if ($alertaPrincipal['peso'] === 3) {
        $level = 'danger';
        $emoji = 'perigo.svg';
    } elseif ($alertaPrincipal['peso'] === 2) {
        $level = 'warning';
        $emoji = 'alerta.svg';
    } else {
        $level = 'normal';
        $emoji = 'info.svg';
    }
    
    $outrosFormatados = [];
    foreach ($outrosAlertas as $alerta) {
        $outrosFormatados[] = [
            'titulo' => $alerta['titulo'],
            'descricao' => $alerta['descricao'],
            'severidade' => $alerta['severidade'],
            'inicio' => $alerta['inicio'],
            'fim' => $alerta['fim'],
            'peso' => $alerta['peso'],
            'status' => $alerta['status']
        ];
    }
    
    echo json_encode([
        'status' => 'alerta',
        'total' => count($todosAlertas),
        'principal' => [
            'titulo' => $alertaPrincipal['titulo'],
            'descricao' => $alertaPrincipal['descricao'],
            'severidade' => $alertaPrincipal['severidade'],
            'inicio' => $alertaPrincipal['inicio'],
            'fim' => $alertaPrincipal['fim'],
            'level' => $level,
            'emoji' => $emoji,
            'peso' => $alertaPrincipal['peso']
        ],
        'outros' => $outrosFormatados
    ]);
} else if (count($alertasFuturos) > 0) {
    // Só tem alertas futuros - NÃO mostra principal
    // Retorna status 'normal' mas com os futuros para serem exibidos no modal
    $outrosFormatados = [];
    foreach ($alertasFuturos as $alerta) {
        $outrosFormatados[] = [
            'titulo' => $alerta['titulo'],
            'descricao' => $alerta['descricao'],
            'severidade' => $alerta['severidade'],
            'inicio' => $alerta['inicio'],
            'fim' => $alerta['fim'],
            'peso' => $alerta['peso']
        ];
    }
    
    echo json_encode([
        'status' => 'normal',
        'message' => 'Não há avisos emergenciais para o Noroeste Paranaense neste momento.',
        'futuros' => $outrosFormatados
    ]);
} else {
    echo json_encode(['status' => 'normal', 'message' => 'Não há avisos emergenciais para o Noroeste Paranaense neste momento.']);
}