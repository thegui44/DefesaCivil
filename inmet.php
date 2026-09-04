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
    $dataStr = preg_replace('/\.0$/', '', $dataStr);
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
    if (empty($inicio) && empty($fim)) {
        return 'ativo'; // Sem data, considera ativo
    }
    
    $dataInicio = parseDataRSS($inicio);
    $dataFim = parseDataRSS($fim);
    
    // Verifica se já expirou (tem data de fim)
    if ($dataFim !== false && $dataFim < $dataAtual) {
        return 'expirado'; // Já passou
    }
    
    // Verifica se ainda não começou (tem data de início)
    if ($dataInicio !== false && $dataInicio > $dataAtual) {
        return 'futuro'; // Ainda vai começar
    }
    
    return 'ativo'; // Está em andamento
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
// ORDENAÇÃO: POR DATA (mais recente primeiro)
// ============================================
function ordenarPorData($a, $b) {
    $dataA = parseDataRSS($a['inicio']);
    $dataB = parseDataRSS($b['inicio']);
    if ($dataA && $dataB) {
        $diff = $dataB->getTimestamp() - $dataA->getTimestamp();
        if ($diff != 0) {
            return $diff;
        }
    }
    // Se mesma data, ordena por peso (maior primeiro)
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
if (count($alertasAtivos) > 0 || count($alertasFuturos) > 0) {
    // Prioridade: alertas ativos primeiro
    $todosAlertas = array_merge($alertasAtivos, $alertasFuturos);
    $alertaPrincipal = $todosAlertas[0];
    
    // Outros alertas são todos exceto o principal
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
            'peso' => $alerta['peso']
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
} else {
    echo json_encode(['status' => 'normal', 'message' => 'Não há avisos emergenciais para o Noroeste Paranaense neste momento.']);
}