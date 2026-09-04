// ================================================================
// DEFESA CIVIL DE FLORAÍ - CÓDIGO JAVASCRIPT 
// Versão 5 - Organizado e comentado para edição
// ================================================================

// ================================================================
// 1. CONFIGURAÇÕES GERAIS (EDIÇÃO PARA OUTROS MUNICÍPIOS)
// ================================================================

/** 
 * CONFIGURAÇÕES DO MUNICÍPIO
 * Altere estes valores para adaptar a outro município
 */
const MUNICIPIO = {
    nome: 'Floraí',
    estado: 'PR',
    latitude: -23.3178,
    longitude: -52.3028,
    timezone: 'America/Sao_Paulo'
};

/** 
 * CHAVE DA API WEATHERAPI
 * Substitua pela sua chave por uma questão de limites de consulta - chave gratuíta
 */
const WEATHERAPI_KEY = '6b1b5cfd7da34f4fbaf231000263008';

// ================================================================
// 2. TEMA (CLARO/ESCURO)
// ================================================================

const html = document.documentElement;
const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
const themeToggleMobileNav = document.getElementById('theme-toggle-mobile-nav');
const themeIconDesktop = document.getElementById('theme-icon-desktop');
const themeIconMobileNav = document.getElementById('theme-icon-mobile-nav');

/**
 * Alterna entre tema claro e escuro
 */
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
}

/**
 * Atualiza os ícones do tema
 */
function updateThemeIcons(theme) {
    const iconPath = theme === 'light' 
        ? '@image/icones/lua.svg' 
        : '@image/icones/sol.svg';
    const altText = theme === 'light' 
        ? 'Alternar para tema escuro' 
        : 'Alternar para tema claro';
    
    if (themeIconDesktop) {
        themeIconDesktop.src = iconPath;
        themeIconDesktop.alt = altText;
    }
    if (themeIconMobileNav) {
        themeIconMobileNav.src = iconPath;
        themeIconMobileNav.alt = altText;
    }
}

// Eventos dos botões de tema
if (themeToggleDesktop) themeToggleDesktop.addEventListener('click', toggleTheme);
if (themeToggleMobileNav) themeToggleMobileNav.addEventListener('click', toggleTheme);

// ================================================================
// 3. MODAIS
// ================================================================

/**
 * Abre um modal pelo ID
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Fecha um modal pelo ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (modalId === 'modal-abrigos') {
            fecharTodosAbrigos();
        }
    }
}

/**
 * Fecha todos os modais abertos
 */
function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
    fecharTodosAbrigos();
}

// Fechar modal ao clicar no backdrop
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
        if (e.target.id === 'modal-abrigos') {
            fecharTodosAbrigos();
        }
    }
});

// ================================================================
// 4. OUTROS ALERTAS - ABRIR MODAL
// ================================================================

function abrirOutrosAlertas() {
    const container = document.getElementById('outros-alertas-container');
    if (!container) return;
    
    const outros = window.outrosAlertas || [];
    
    if (outros.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:20px;">Nenhum outro alerta ativo no momento.</p>';
        openModal('modal-outros-alertas');
        return;
    }
    
    let html = '';
    outros.forEach((alerta, index) => {
        let cor = '#f1c40f'; // Amarelo padrão
        if (alerta.peso === 3) cor = '#e74c3c'; // Vermelho
        else if (alerta.peso === 2) cor = '#e67e22'; // Laranja
        
        // Converte data para formato brasileiro
        let dataTexto = '';
        if (alerta.inicio && alerta.fim) {
            const inicioFormatado = alerta.inicio.replace(/(\d{4})-(\d{2})-(\d{2}) \d{2}:\d{2}.*/, '$3/$2/$1');
            const fimFormatado = alerta.fim.replace(/(\d{4})-(\d{2})-(\d{2}) \d{2}:\d{2}.*/, '$3/$2/$1');
            dataTexto = `<img src="@image/icones/calendario.svg" alt="Calendário" class="icone-peq"> ${inicioFormatado} até ${fimFormatado}`;
        } else if (alerta.inicio) {
            const inicioFormatado = alerta.inicio.replace(/(\d{4})-(\d{2})-(\d{2}) \d{2}:\d{2}.*/, '$3/$2/$1');
            dataTexto = `<img src="@image/icones/calendario.svg" alt="Calendário" class="icone-peq"> Início: ${inicioFormatado}`;
        } else if (alerta.fim) {
            const fimFormatado = alerta.fim.replace(/(\d{4})-(\d{2})-(\d{2}) \d{2}:\d{2}.*/, '$3/$2/$1');
            dataTexto = `<img src="@image/icones/calendario.svg" alt="Calendário" class="icone-peq"> Fim: ${fimFormatado}`;
        }
        
        html += `
            <div style="background:var(--card-bg);border-left:4px solid ${cor};border-radius:6px;padding:14px 16px;margin-bottom:10px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    <span style="font-weight:bold;color:var(--text-primary);">${alerta.titulo}</span>
                    <span style="font-size:0.65rem;background:${cor};color:#fff;padding:2px 10px;border-radius:10px;">${alerta.severidade}</span>
                    <span style="font-size:0.6rem;color:var(--text-secondary);margin-left:auto;">#${index + 1}</span>
                </div>
                <div style="font-size:0.8rem;color:var(--text-secondary);">${alerta.descricao}</div>
                ${dataTexto ? `<div style="font-size:0.7rem;color:var(--text-secondary);margin-top:4px;opacity:0.7;">${dataTexto}</div>` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
    openModal('modal-outros-alertas');
}

// ================================================================
// 5. EQUIPE
// ================================================================

/**
 * Dados da equipe - Edite para alterar os membros
 */
const TEAM_MEMBERS = [
    { name: 'José Antonio', role: 'Coordenador' },
    { name: 'Andrei Barbosa', role: 'Secretário' },
    { name: 'Guilherme Henrique', role: 'Diretor Operacional' }
];

function renderTeam() {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;
    
    grid.innerHTML = TEAM_MEMBERS.map(m => `
        <div class="team-member">
            <div class="team-avatar">
                <img src="@image/logotipos/defciv.svg" alt="${m.name}" class="team-avatar-icon">
            </div>
            <h4>${m.name}</h4>
            <p>${m.role}</p>
        </div>
    `).join('');
}

// ================================================================
// 6. LIGHTBOX (VISUALIZADOR DE IMAGENS)
// ================================================================

let lightboxImages = [];
let currentLightboxIndex = 0;

/**
 * Dados das imagens - Edite para adicionar/remover imagens
 */
const POSTS_IMAGES = [
    { image: '@image/posts/1.jpg', label: 'Limpeza de Calhas' },
    { image: '@image/posts/2.jpg', label: 'Alertas por SMS' },
    { image: '@image/posts/3.jpg', label: 'Limpeza de Bueiros' },
    { image: '@image/posts/4.jpg', label: 'Destelhamentos' }
];

function renderInstagram() {
    const grid = document.getElementById('instagramGrid');
    if (!grid) return;
    
    lightboxImages = POSTS_IMAGES;
    
    grid.innerHTML = POSTS_IMAGES.map((p, index) => `
        <div class="insta-item" onclick="openLightbox(${index})" style="cursor:pointer;">
            <img 
                src="${p.image}" 
                alt="${p.label}" 
                loading="lazy"
                style="width:100%;height:100%;object-fit:cover;"
                onerror="this.style.display='none'"
            >
            <div class="insta-overlay">Clique para ampliar</div>
        </div>
    `).join('');
}

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');
    
    if (!lightboxImages[index]) return;
    
    image.src = lightboxImages[index].image;
    caption.textContent = lightboxImages[index].label;
    counter.textContent = `${index + 1} / ${lightboxImages.length}`;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function changeLightboxImage(direction) {
    const total = lightboxImages.length;
    if (total === 0) return;
    
    currentLightboxIndex = (currentLightboxIndex + direction + total) % total;
    
    const image = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');
    
    image.style.opacity = '0';
    setTimeout(() => {
        image.src = lightboxImages[currentLightboxIndex].image;
        caption.textContent = lightboxImages[currentLightboxIndex].label;
        counter.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
        image.style.opacity = '1';
    }, 200);
}

// Fechar lightbox ao clicar fora
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active') && e.target === lightbox) {
        closeLightbox();
    }
});

// ================================================================
// 7. INICIALIZAÇÃO
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Defesa Civil - Site Inicializado');

    // Carrega tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
    } else {
        const currentTheme = html.getAttribute('data-theme') || 'light';
        updateThemeIcons(currentTheme);
    }

    // Renderiza componentes
    renderTeam();
    renderInstagram();
    renderAbrigos();
    resetAlertCards();

    // Busca dados
    console.log('Buscando alertas INMET...');
    fetchInmetAlerts();
    
    console.log('Buscando dados climáticos...');
    fetchWeatherData();
    
    console.log('Buscando fase da lua...');
    atualizarFaseLua();
    
    // Atualiza a cada 5 minutos
    setInterval(() => {
        fetchInmetAlerts();
        fetchWeatherData();
        atualizarFaseLua();
    }, 300000);

    console.log('Defesa Civil - Pronto!');
});

// ================================================================
// 8. ATALHOS DE TECLADO
// ================================================================

document.addEventListener('keydown', (e) => {
    // ESC fecha modais e lightbox
    if (e.key === 'Escape') {
        closeAllModals();
        closeLightbox();
    }
    // M alterna tema
    if (e.key === 'm' || e.key === 'M') {
        toggleTheme();
    }
    // Setas navegam no lightbox
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            const direction = e.key === 'ArrowLeft' ? -1 : 1;
            changeLightboxImage(direction);
            e.preventDefault();
        }
    }
});

console.log('Atalhos: ESC fecha modais | M alterna tema | ← → navega no lightbox');

// ================================================================
// 9. API DO CLIMA - OPEN-METEO
// ================================================================

const WEATHER_CODES = {
    0: { description: 'Céu limpo', emoji: 'animado/sol.png' },
    1: { description: 'Predominantemente limpo', emoji: 'animado/sol-nuvem.png' },
    2: { description: 'Parcialmente nublado', emoji: 'animado/nuvem-sol.png' },
    3: { description: 'Nublado', emoji: 'animado/nuvem.png' },
    45: { description: 'Nevoeiro', emoji: 'animado/nevoeiro.png' },
    48: { description: 'Nevoeiro com geada', emoji: 'animado/nevoeiro.png' },
    51: { description: 'Garoa fina', emoji: 'animado/chuva-fraca.png' },
    53: { description: 'Garoa moderada', emoji: 'animado/chuva-fraca.png' },
    55: { description: 'Garoa forte', emoji: 'animado/chuva.png' },
    61: { description: 'Chuva fraca', emoji: 'animado/chuva.png' },
    63: { description: 'Chuva moderada', emoji: 'animado/chuva.png' },
    65: { description: 'Chuva forte', emoji: 'animado/chuva.png' },
    71: { description: 'Neve fraca', emoji: 'animado/neve.png' },
    73: { description: 'Neve moderada', emoji: 'animado/neve.png' },
    75: { description: 'Neve forte', emoji: 'animado/neve.png' },
    77: { description: 'Grãos de neve', emoji: 'animado/neve.png' },
    80: { description: 'Chuvisco fraco', emoji: 'animado/chuva-fraca.png' },
    81: { description: 'Chuvisco moderado', emoji: 'animado/chuva.png' },
    82: { description: 'Chuvisco forte', emoji: 'animado/chuva.png' },
    85: { description: 'Neve fraca', emoji: 'animado/neve.png' },
    86: { description: 'Neve forte', emoji: 'animado/neve.png' },
    95: { description: 'Tempestade fraca', emoji: 'animado/tempestade.png' },
    96: { description: 'Tempestade com granizo', emoji: 'animado/tempestade.png' },
    99: { description: 'Tempestade com granizo forte', emoji: 'animado/tempestade.png' }
};

function getWeatherInfo(code) {
    return WEATHER_CODES[code] || { description: 'Condição desconhecida', emoji: 'animado/satelite.png' };
}

function getWeatherSVG(emoji) {
    return `@image/icones/${emoji}`;
}

// ================================================================
// 10. FASE DA LUA - WEATHERAPI COM CACHE
// ================================================================

const WEATHERAPI_URL = 'https://api.weatherapi.com/v1/astronomy.json';

let moonPhaseCache = {
    data: null,
    timestamp: null,
    cacheDuration: 5 * 60 * 1000 // 5 minutos
};

/**
 * MAPEAMENTO DAS FASES DA LUA
 * Chave: nome que vem da API (inglês)
 * Valor: nome exibido no card (português)
 */
const MOON_PHASES_MAP = {
    'New Moon': 'Nova',
    'Waxing Crescent': 'Crescente',
    'First Quarter': 'Crescente',
    'Waxing Gibbous': 'Crescente',
    'Full Moon': 'Cheia',
    'Waning Gibbous': 'Minguante',
    'Last Quarter': 'Minguante',
    'Waning Crescent': 'Minguante'
};

/**
 * MAPEAMENTO DAS FASES PARA ÍCONES
 * Chave: nome em português
 * Valor: nome do arquivo SVG
 */
const MOON_ICONS_MAP = {
    'Nova': 'luanova.svg',
    'Crescente': 'luacresc.svg',
    'Cheia': 'luacheia.svg',
    'Minguante': 'luaming.svg'
};

/**
 * Retorna o ícone correspondente à fase da lua
 */
function getMoonIcon(faseLabel) {
    if (!faseLabel || faseLabel === '--') {
        return 'luanova.svg';
    }
    return MOON_ICONS_MAP[faseLabel] || 'luanova.svg';
}

/**
 * Traduz a fase da lua do inglês para o português
 */
function traduzirFaseLua(faseIngles) {
    if (!faseIngles || faseIngles === '--') return '--';
    if (MOON_PHASES_MAP[faseIngles]) return MOON_PHASES_MAP[faseIngles];
    
    const faseLower = faseIngles.toLowerCase();
    for (const [key, value] of Object.entries(MOON_PHASES_MAP)) {
        if (key.toLowerCase().includes(faseLower) || faseLower.includes(key.toLowerCase())) {
            return value;
        }
    }
    return faseIngles;
}

async function fetchMoonPhase() {
    const now = Date.now();
    
    if (moonPhaseCache.data && moonPhaseCache.timestamp) {
        const idadeCache = now - moonPhaseCache.timestamp;
        if (idadeCache < moonPhaseCache.cacheDuration) {
            console.log('Usando cache da lua (idade:', Math.round(idadeCache / 1000), 's)');
            return moonPhaseCache.data;
        }
    }
    
    console.log('Buscando fase da lua na WeatherAPI...');
    
    try {
        const hoje = new Date();
        const dataStr = hoje.toISOString().split('T')[0];
        const url = `${WEATHERAPI_URL}?key=${WEATHERAPI_KEY}&q=${MUNICIPIO.latitude},${MUNICIPIO.longitude}&dt=${dataStr}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        const moonData = {
            phase: data.astronomy.astro.moon_phase || '--',
            illumination: data.astronomy.astro.moon_illumination || '--',
            idade: data.astronomy.astro.moon_age || '--',
            nascer: data.astronomy.astro.moonrise || '--',
            por: data.astronomy.astro.moonset || '--'
        };
        
        moonPhaseCache.data = moonData;
        moonPhaseCache.timestamp = now;
        return moonData;
        
    } catch (error) {
        console.error('Erro ao buscar fase da lua:', error);
        if (moonPhaseCache.data) {
            console.log('Usando cache antigo como fallback');
            return moonPhaseCache.data;
        }
        return { phase: '--', illumination: '--', idade: '--', nascer: '--', por: '--' };
    }
}

async function atualizarFaseLua() {
    const moonImg = document.getElementById('weather-moon-img');
    const moonText = document.getElementById('weather-moon-text');
    
    if (!moonImg || !moonText) return;
    
    const moonData = await fetchMoonPhase();
    
    if (moonData && moonData.phase !== '--') {
        // Traduz a fase
        const faseLabel = traduzirFaseLua(moonData.phase);
        
        // Define o ícone baseado na fase traduzida
        const iconFile = getMoonIcon(faseLabel);
        
        // Atualiza o ícone
        moonImg.src = `@image/icones/${iconFile}`;
        moonImg.alt = faseLabel;
        
        // Atualiza o texto: "Crescente (45%)"
        let texto = faseLabel;
        if (moonData.illumination && moonData.illumination !== '--') {
            texto += ` (${moonData.illumination}%)`;
        }
        moonText.innerText = texto;
    } else {
        moonImg.src = '@image/icones/luanova.svg';
        moonImg.alt = 'Indisponível';
        moonText.innerText = '--';
    }
}

// ================================================================
// 11. ALERTAS - RESET
// ================================================================

function resetAlertCards() {
    // INMET
    const cardInmet = document.getElementById('alert-card-inmet');
    const headlineInmet = document.getElementById('alert-headline-inmet');
    const descInmet = document.getElementById('alert-description-inmet');
    const periodInmet = document.getElementById('alert-period-inmet');
    
    if (cardInmet) cardInmet.className = 'dashboard-card alert-card alert-normal';
    if (headlineInmet) {
        headlineInmet.innerHTML = `
            <span class="alert-title-text">
                <img src="@image/icones/animado/load.png" alt="Carregando" class="alert-icon"> 
                Carregando...
            </span>
        `;
    }
    if (descInmet) descInmet.innerHTML = 'Aguardando dados do INMET.';
    if (periodInmet) periodInmet.style.display = 'none';
    
    // Open-Meteo
    const cardOpen = document.getElementById('alert-card-openmeteo');
    const headlineOpen = document.getElementById('alert-headline-openmeteo');
    const descOpen = document.getElementById('alert-description-openmeteo');
    const periodOpen = document.getElementById('alert-period-openmeteo');
    
    if (cardOpen) cardOpen.className = 'dashboard-card alert-card alert-normal';
    if (headlineOpen) {
        headlineOpen.innerHTML = `
            <span class="alert-title-text">
                <img src="@image/icones/animado/load.png" alt="Carregando" class="alert-icon"> 
                Carregando...
            </span>
        `;
    }
    if (descOpen) descOpen.innerHTML = 'Aguardando dados do Open-Meteo.';
    if (periodOpen) periodOpen.style.display = 'none';
}

// ================================================================
// 12. DADOS DO CLIMA - OPEN-METEO
// ================================================================

async function fetchWeatherData() {
    console.log('Buscando dados do Open-Meteo...');
    
    const elements = {
        icon: document.getElementById('weather-icon'),
        temp: document.getElementById('weather-temp'),
        city: document.getElementById('weather-city'),
        min: document.getElementById('weather-min'),
        max: document.getElementById('weather-max'),
        condition: document.getElementById('weather-condition'),
        feels: document.getElementById('weather-feels'),
        humidity: document.getElementById('weather-humidity'),
        wind: document.getElementById('weather-wind'),
        gust: document.getElementById('weather-gust'),
        precip: document.getElementById('weather-precip'),
        rainProb: document.getElementById('weather-rain-prob'),
        sunrise: document.getElementById('weather-sunrise'),
        sunset: document.getElementById('weather-sunset'),
        moon: document.getElementById('weather-moon'),
        updated: document.getElementById('weather-updated')
    };
    
    // Estado de carregamento
    if (elements.icon) elements.icon.innerHTML = `<img src="@image/icones/animado/load.png" alt="Carregando" style="width:80px;height:80px;">`;
    if (elements.temp) elements.temp.innerHTML = '--°';
    if (elements.city) elements.city.innerText = 'Carregando...';
    if (elements.min) elements.min.innerText = '--';
    if (elements.max) elements.max.innerText = '--';
    if (elements.condition) elements.condition.innerText = 'Carregando...';
    if (elements.feels) elements.feels.innerText = '--°C';
    if (elements.humidity) elements.humidity.innerText = '--%';
    if (elements.wind) elements.wind.innerText = '-- km/h';
    if (elements.gust) elements.gust.innerText = '-- km/h';
    if (elements.precip) elements.precip.innerText = '-- mm';
    if (elements.rainProb) elements.rainProb.innerText = '--%';
    if (elements.sunrise) elements.sunrise.innerText = '--:--';
    if (elements.sunset) elements.sunset.innerText = '--:--';
    if (elements.moon) elements.moon.innerText = '--';
    if (elements.updated) elements.updated.innerText = '--/--/---- --:--';
    
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${MUNICIPIO.latitude}&longitude=${MUNICIPIO.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,sunrise,sunset&timezone=${MUNICIPIO.timezone}&forecast_days=3`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        processarDadosClima(data);
        
    } catch (error) {
        console.error('Erro ao buscar dados do Open-Meteo:', error);
        mostrarErroClima(error.message);
    }
}

function processarDadosClima(data) {
    const current = data.current || {};
    const daily = data.daily || {};
    
    if (!current || current.temperature_2m === undefined) {
        throw new Error('Dados de clima inválidos');
    }
    
    const weatherInfo = getWeatherInfo(current.weather_code || 0);
    
    // Processa dados
    const dados = {
        temperatura: Math.round(current.temperature_2m || 0),
        sensacao: Math.round(current.apparent_temperature || 0),
        umidade: Math.round(current.relative_humidity_2m || 0),
        vento: Math.round(current.wind_speed_10m || 0),
        rajada: Math.round(current.wind_gusts_10m || 0),
        precipitacao: Math.round((current.precipitation || 0) * 10) / 10,
        condicao: weatherInfo.description,
        icone: weatherInfo.emoji,
        min: daily.temperature_2m_min?.[0] !== undefined ? Math.round(daily.temperature_2m_min[0]) : null,
        max: daily.temperature_2m_max?.[0] !== undefined ? Math.round(daily.temperature_2m_max[0]) : null,
        probChuva: daily.precipitation_probability_max?.[0] !== undefined ? Math.round(daily.precipitation_probability_max[0]) : 0
    };
    
    // Nascer/Pôr do sol
    let nascerStr = '--:--', porStr = '--:--';
    if (daily.sunrise?.[0]) {
        try {
            nascerStr = new Date(daily.sunrise[0]).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {}
    }
    if (daily.sunset?.[0]) {
        try {
            porStr = new Date(daily.sunset[0]).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {}
    }
    
    // Atualiza elementos
    const els = {
        city: document.getElementById('weather-city'),
        temp: document.getElementById('weather-temp'),
        humidity: document.getElementById('weather-humidity'),
        wind: document.getElementById('weather-wind'),
        gust: document.getElementById('weather-gust'),
        feels: document.getElementById('weather-feels'),
        icon: document.getElementById('weather-icon'),
        updated: document.getElementById('weather-updated'),
        min: document.getElementById('weather-min'),
        max: document.getElementById('weather-max'),
        condition: document.getElementById('weather-condition'),
        precip: document.getElementById('weather-precip'),
        rainProb: document.getElementById('weather-rain-prob'),
        sunrise: document.getElementById('weather-sunrise'),
        sunset: document.getElementById('weather-sunset')
    };
    
    if (els.city) els.city.innerText = `${MUNICIPIO.nome}/${MUNICIPIO.estado}`;
    if (els.temp) els.temp.innerHTML = `${dados.temperatura}°`;
    if (els.humidity) els.humidity.innerText = `${dados.umidade}%`;
    if (els.wind) els.wind.innerText = `${dados.vento} km/h`;
    if (els.gust) els.gust.innerText = dados.rajada > 0 ? `${dados.rajada} km/h` : '--';
    if (els.feels) els.feels.innerText = `${dados.sensacao}°C`;
    if (els.min) els.min.innerText = dados.min !== null ? dados.min : '--';
    if (els.max) els.max.innerText = dados.max !== null ? dados.max : '--';
    if (els.condition) els.condition.innerText = dados.condicao;
    if (els.precip) els.precip.innerText = `${dados.precipitacao} mm`;
    if (els.rainProb) els.rainProb.innerText = `${dados.probChuva}%`;
    if (els.sunrise) els.sunrise.innerText = nascerStr;
    if (els.sunset) els.sunset.innerText = porStr;
    
    if (els.icon) {
        els.icon.innerHTML = `<img src="${getWeatherSVG(dados.icone)}" alt="${dados.condicao}" style="width:80px;height:80px;">`;
    }
    
    const now = new Date();
    if (els.updated) {
        els.updated.innerHTML = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Atualiza lua e alertas
    atualizarFaseLua();
    const alerts = gerarAlertasOpenMeteo(current, daily);
    atualizarAlertasOpenMeteo(alerts, weatherInfo);
    atualizarModalPrevisao(daily);
}

function mostrarErroClima(mensagem) {
    const els = {
        city: document.getElementById('weather-city'),
        temp: document.getElementById('weather-temp'),
        icon: document.getElementById('weather-icon'),
        humidity: document.getElementById('weather-humidity'),
        wind: document.getElementById('weather-wind'),
        gust: document.getElementById('weather-gust'),
        feels: document.getElementById('weather-feels'),
        updated: document.getElementById('weather-updated'),
        min: document.getElementById('weather-min'),
        max: document.getElementById('weather-max'),
        condition: document.getElementById('weather-condition'),
        precip: document.getElementById('weather-precip'),
        rainProb: document.getElementById('weather-rain-prob'),
        sunrise: document.getElementById('weather-sunrise'),
        sunset: document.getElementById('weather-sunset'),
        moon: document.getElementById('weather-moon')
    };
    
    if (els.city) els.city.innerText = `${MUNICIPIO.nome}/${MUNICIPIO.estado}`;
    if (els.temp) els.temp.innerHTML = '--°';
    if (els.humidity) els.humidity.innerText = '--%';
    if (els.wind) els.wind.innerText = '-- km/h';
    if (els.gust) els.gust.innerText = '-- km/h';
    if (els.feels) els.feels.innerText = '--°C';
    if (els.min) els.min.innerText = '--';
    if (els.max) els.max.innerText = '--';
    if (els.condition) els.condition.innerText = 'Indisponível';
    if (els.precip) els.precip.innerText = '-- mm';
    if (els.rainProb) els.rainProb.innerText = '--%';
    if (els.sunrise) els.sunrise.innerText = '--:--';
    if (els.sunset) els.sunset.innerText = '--:--';
    if (els.moon) els.moon.innerText = '--';
    if (els.icon) {
        els.icon.innerHTML = `<img src="@image/icones/animado/satelite.png" alt="Indisponível" style="width:80px;height:80px;">`;
    }
    if (els.updated) els.updated.innerText = new Date().toLocaleString('pt-BR');
}

// ================================================================
// 13. ALERTAS OPEN-METEO
// ================================================================

function gerarAlertasOpenMeteo(current, daily) {
    const alerts = [];
    const windSpeed = current.wind_speed_10m || 0;
    const windGusts = current.wind_gusts_10m || 0;
    const weatherCode = current.weather_code || 0;
    const precipitation = current.precipitation || 0;
    const rain = current.rain || 0;
    const showers = current.showers || 0;
    const anoAtual = new Date().getFullYear(); // Adiciona o ano atual
    
    if (windSpeed > 50 || windGusts > 70) {
        alerts.push({
            event: 'VENTOS FORTES',
            description: `Ventos de ${windSpeed} km/h com rajadas de ${windGusts} km/h. Risco de queda de árvores, destelhamentos e objetos soltos.`,
            severity: 'Perigo',
            level: 'warning',
            emoji: 'tornado.svg',
            period: 'Evite áreas abertas'
        });
    }
    
    if ([95, 96, 99].includes(weatherCode)) {
        alerts.push({
            event: 'TEMPESTADE',
            description: 'Tempestade com raios e ventos fortes. Evite áreas abertas, não se abrigue debaixo de árvores e mantenha-se em local seguro.',
            severity: 'Grande Perigo',
            level: 'danger',
            emoji: 'tempestade.svg',
            period: 'Busque abrigo seguro'
        });
    }
    
    if (rain > 10 || showers > 10 || precipitation > 15) {
        alerts.push({
            event: 'CHUVA INTENSA',
            description: `Precipitação de ${Math.round(precipitation * 10) / 10}mm. Risco de alagamentos e enxurradas.`,
            severity: 'Perigo Potencial',
            level: 'warning',
            emoji: 'chuva.svg',
            period: 'Redobre a atenção'
        });
    }
    
    if (daily.time) {
        for (let i = 0; i < Math.min(daily.time.length, 3); i++) {
            const dayPrecip = daily.precipitation_sum?.[i] || 0;
            const dayProb = daily.precipitation_probability_max?.[i] || 0;
            const dayWind = daily.wind_speed_10m_max?.[i] || 0;
            const dayDate = daily.time[i] || '';
            
            if (dayPrecip > 20 && dayProb > 70) {
                const date = new Date(dayDate + 'T00:00:00');
                const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                alerts.push({
                    event: 'PREVISÃO DE CHUVA FORTE',
                    description: `Previsão de chuva forte para ${dateStr} com ${Math.round(dayProb)}% de probabilidade e ${Math.round(dayPrecip)}mm.`,
                    severity: 'Perigo Potencial',
                    level: 'warning',
                    emoji: 'calendario.svg',
                    period: `Fique atento para ${dateStr}/${anoAtual}`  // ← Adiciona o ano
                });
                break;
            }
            
            if (dayWind > 60) {
                const date = new Date(dayDate + 'T00:00:00');
                const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                alerts.push({
                    event: 'VENTOS FORTES PREVISTOS',
                    description: `Ventos de até ${Math.round(dayWind)} km/h previstos para ${dateStr}.`,
                    severity: 'Perigo Potencial',
                    level: 'warning',
                    emoji: 'calendario.svg',
                    period: `Fique atento para ${dateStr}/${anoAtual}`  // ← Adiciona o ano
                });
                break;
            }
        }
    }
    
    return alerts.slice(0, 3);
}

function atualizarAlertasOpenMeteo(alerts, weatherInfo) {
    const alertCard = document.getElementById('alert-card-openmeteo');
    const alertHeadline = document.getElementById('alert-headline-openmeteo');
    const alertDescription = document.getElementById('alert-description-openmeteo');
    const alertPeriod = document.getElementById('alert-period-openmeteo');

    if (!alertCard || !alertHeadline || !alertDescription) return;

    if (alerts && alerts.length > 0) {
        const alerta = alerts[0];
        let levelClass = 'alert-normal';
        let iconPath = '@image/icones/check.svg';
        
        switch (alerta.level) {
            case 'danger':
                levelClass = 'alert-danger';
                iconPath = '@image/icones/alerta.svg';
                break;
            case 'warning':
                levelClass = 'alert-warning';
                iconPath = '@image/icones/exclamacao.svg';
                break;
            default:
                levelClass = 'alert-normal';
                iconPath = '@image/icones/info.svg';
                break;
        }
        
         alertCard.className = `dashboard-card alert-card ${levelClass}`;
        
        // Estrutura unificada: Título com ícone + Severidade + Descrição
        alertHeadline.innerHTML = `
            <span class="alert-title-text">
                <img src="${iconPath}" alt="${alerta.event}" class="alert-icon"> 
                ${alerta.event}
            </span>
            <span class="alert-severity-text">${alerta.severity}</span>
        `;
        
        alertDescription.innerHTML = alerta.description;
        
        if (alertPeriod) {
            if (alerta.period) {
                alertPeriod.style.display = 'block';
                alertPeriod.innerHTML = `<img src="@image/icones/relogio.svg" alt="Relógio" class="icone-peq"> ${alerta.period}`;
            } else {
                alertPeriod.style.display = 'none';
            }
        }
    } else {
        alertCard.className = 'dashboard-card alert-card alert-normal';
        alertHeadline.innerHTML = `
            <span class="alert-title-text">
                <img src="@image/icones/vento.svg" alt="Informação" class="alert-icon"> 
                Sem Alertas Ativos
            </span>
        `;
        alertDescription.innerHTML = `
            Não há avisos disponíveis pela Open-Meteo no momento.
            <br><small style="opacity:0.6;">Dados atualizados automaticamente a cada 5 minutos.</small>
        `;
        if (alertPeriod) alertPeriod.style.display = 'none';
    }
}

// ================================================================
// 14. MODAL PREVISÃO
// ================================================================

function atualizarModalPrevisao(daily) {
    const painel = document.getElementById('painel-previsao');
    if (!painel) return;
    
    if (!daily || !daily.time || daily.time.length === 0) {
        painel.innerHTML = `<p style="text-align:center;padding:20px;color:#888;">Previsão indisponível no momento.</p>`;
        return;
    }
    
    let html = '';
    html += `
        <div style="background:var(--card-bg);border-radius:8px;padding:16px;margin-bottom:12px;">
            <h3 style="margin:0 0 12px 0;color:var(--text-primary);">
                <img src="@image/icones/calendario.svg" alt="Previsão" style="width:24px;height:24px;vertical-align:middle;"> Previsão para os Próximos Dias
            </h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;">
    `;
    
    for (let i = 0; i < Math.min(daily.time.length, 3); i++) {
        const date = new Date(daily.time[i] + 'T00:00:00');
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const dayDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const dayCode = daily.weather_code?.[i] || 0;
        const dayInfo = getWeatherInfo(dayCode);
        const tempMax = Math.round(daily.temperature_2m_max?.[i] || 0);
        const tempMin = Math.round(daily.temperature_2m_min?.[i] || 0);
        const precip = Math.round(daily.precipitation_sum?.[i] || 0);
        const prob = Math.round(daily.precipitation_probability_max?.[i] || 0);
        
        html += `
            <div style="background:var(--bg-secondary);padding:12px;border-radius:6px;text-align:center;color:var(--text-primary);">
                <div style="font-weight:bold;font-size:0.85rem;">${dayName}</div>
                <div style="font-size:0.75rem;color:var(--text-secondary);">${dayDate}</div>
                <div style="margin:4px 0;">
                    <img src="${getWeatherSVG(dayInfo.emoji)}" alt="${dayInfo.description}" style="width:32px;height:32px;">
                </div>
                <div style="font-size:0.8rem;">${dayInfo.description}</div>
                <div style="font-size:0.85rem;font-weight:bold;">${tempMax}° / ${tempMin}°</div>
                <div style="font-size:0.7rem;color:var(--text-secondary);">
                    ${prob > 0 ? `${prob}%` : ''}${precip > 0 ? ` ${precip}mm` : ''}
                </div>
            </div>
        `;
    }
    
    html += `</div></div>`;
    painel.innerHTML = html;
}

// ================================================================
// 15. ALERTAS INMET
// ================================================================

async function fetchInmetAlerts() {
    console.log('Buscando alertas do INMET...');
    try {
        const response = await fetch('inmet.php');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.status === 'alerta') {
            atualizarAlertaINMET(data);
        } else {
            atualizarAlertaINMET(null);
        }
    } catch (error) {
        console.error('Erro ao buscar alertas INMET:', error);
        atualizarAlertaINMET(null);
    }
}

function atualizarAlertaINMET(data) {
    const alertCard = document.getElementById('alert-card-inmet');
    const alertHeadline = document.getElementById('alert-headline-inmet');
    const alertDescription = document.getElementById('alert-description-inmet');
    const alertPeriod = document.getElementById('alert-period-inmet');
    
    if (!alertCard || !alertHeadline || !alertDescription) return;

    if (data && data.status === 'alerta') {
        const principal = data.principal;
        const outros = data.outros || [];
        
        let levelClass = 'alert-normal';
        let emojiPath = '@image/icones/check.svg';
        
        if (principal.peso === 3) {
            levelClass = 'alert-danger';
            emojiPath = '@image/icones/alerta.svg';
        } else if (principal.peso === 2) {
            levelClass = 'alert-warning';
            emojiPath = '@image/icones/exclamacao.svg';
        } else {
            levelClass = 'alert-warning';
            emojiPath = '@image/icones/alerta.svg';
        }
        
        alertCard.className = `dashboard-card alert-card ${levelClass}`;
        
        // Título com ícone, texto e botão "outros alertas" ao lado
        let tituloHtml = `
            <span class="alert-title-text">
                <img src="${emojiPath}" alt="${principal.severidade}" class="alert-icon"> 
                ${principal.titulo}
                ${outros.length > 0 ? `<span class="btn-outros-alertas" onclick="abrirOutrosAlertas()">+${outros.length} alerta${outros.length > 1 ? 's' : ''} ativo</span>` : ''}
            </span>
        `;

        alertHeadline.innerHTML = tituloHtml;
        alertDescription.innerHTML = `<strong>${principal.severidade}</strong><br>${principal.descricao}`;
        
        // Período no formato brasileiro
        let periodText = '';
        if (principal.inicio && principal.fim) {
            const inicioFormatado = principal.inicio.replace(/(\d{4})-(\d{2})-(\d{2}) \d{2}:\d{2}.*/, '$3/$2/$1');
            const fimFormatado = principal.fim.replace(/(\d{4})-(\d{2})-(\d{2}) \d{2}:\d{2}.*/, '$3/$2/$1');
            periodText = `Vigência: ${inicioFormatado} até ${fimFormatado}`;
        } else if (principal.inicio) {
            const inicioFormatado = principal.inicio.replace(/(\d{4})-(\d{2})-(\d{2}) \d{2}:\d{2}.*/, '$3/$2/$1');
            periodText = `Início: ${inicioFormatado}`;
        } else if (principal.fim) {
            const fimFormatado = principal.fim.replace(/(\d{4})-(\d{2})-(\d{2}) \d{2}:\d{2}.*/, '$3/$2/$1');
            periodText = `Fim: ${fimFormatado}`;
        }
        
        if (alertPeriod) {
            if (periodText) {
                alertPeriod.style.display = 'block';
                alertPeriod.innerHTML = `<img src="@image/icones/relogio.svg" alt="Relógio" class="icone-peq"> ${periodText}`;
            } else {
                alertPeriod.style.display = 'none';
            }
        }
        
        window.outrosAlertas = outros;
        
    } else if (data === null) {
        alertCard.className = 'dashboard-card alert-card alert-normal';
        alertHeadline.innerHTML = `
            <span class="alert-title-text">
                <img src="@image/icones/exclamacao.svg" alt="Indisponível" class="alert-icon"> 
                Serviço Indisponível
            </span>
        `;
        alertDescription.innerHTML = `
            Não foi possível obter dados do INMET no momento.
            <br><small style="opacity:0.6;">Tente novamente ou consulte o <a href="https://portal.inmet.gov.br/" target="_blank" rel="noopener noreferrer">site oficial</a>.</small>
        `;
        if (alertPeriod) alertPeriod.style.display = 'none';
        window.outrosAlertas = [];
    } else {
        alertCard.className = 'dashboard-card alert-card alert-normal';
        alertHeadline.innerHTML = `
            <span class="alert-title-text">
                <img src="@image/icones/vento.svg" alt="Informação" class="alert-icon"> 
                Sem Alertas Ativos
            </span>
        `;
        alertDescription.innerHTML = `
            Não há avisos disponíveis pelo INMET no momento.
            <br><small style="opacity:0.6;">Dados atualizados automaticamente a cada 5 minutos.</small>
        `;
        if (alertPeriod) alertPeriod.style.display = 'none';
        window.outrosAlertas = [];
    }
}

// ================================================================
// 16. ABRIGOS
// ================================================================

let abrigoExpandido = null;

function renderAbrigos() {
    const container = document.getElementById('abrigos-container');
    if (!container) return;

    /** 
     * Dados dos abrigos - Edite para adicionar/remover abrigos
     * O iframe é o link do Google Maps Street View
     */
    const abrigos = [
        {
            nome: 'CAP Padre Ângelo Rabachin',
            endereco: 'Rua Tiradentes, 363',
            capacidade: '60 pessoas',
            telefone: '(44) 3242-8333',
            observacoes: 'Abrigo Centro',
            responsavel: 'Regina de Deus Pereira',
            iframe: 'https://www.google.com/maps/embed?pb=!4v1787332442853!6m8!1m7!1scXUHw8p1bIYC_9bMz3LCNQ!2m2!1d-23.32180426952802!2d-52.29984154565143!3f121.18814108212221!4f-10.23276185206575!5f0.7820865974627469'
        },
        {
            nome: 'CMEI Menino Jesus',
            endereco: 'Rua Getulio Vargas, 1096',
            capacidade: '80 pessoas',
            telefone: '(44) 3242-8332',
            observacoes: 'Abrigo Norte',
            responsavel: 'Tatiana Belmonte Botaro Sanches',
            iframe: 'https://www.google.com/maps/embed?pb=!4v1787332366276!6m8!1m7!1sgVQ19ZQLwLhu9kPrMy5hHg!2m2!1d-23.31469846255471!2d-52.3079123816997!3f62.70644656144767!4f-3.879254324931523!5f0.7820865974627469'
        },
        {
            nome: 'CMEI Wanda Maria de Lucca',
            endereco: 'Rua Alziro Marassi, 330',
            capacidade: '115 pessoas',
            telefone: '(44) 3242-8330',
            observacoes: 'Abrigo Oeste',
            responsavel: 'Leila Daiane Conti',
            iframe: 'https://www.google.com/maps/embed?pb=!4v1787316383001!6m8!1m7!1sNTa4qKPepLvDlJlr-si3mg!2m2!1d-23.31827745080287!2d-52.3100478883638!3f25.132445863730958!4f5.1964079142260715!5f1.5353860272957096'
        },
        {
            nome: 'EMEF Elena Maria Pedroni',
            endereco: 'Rua Augusto Ventura, 285',
            capacidade: '120 pessoas',
            telefone: '(44) 3242-8331',
            observacoes: 'Abrigo Leste',
            responsavel: 'Rosilene Aparecida Ariozi Viotto',
            iframe: 'https://www.google.com/maps/embed?pb=!4v1787332211201!6m8!1m7!1saDFWMmaNK1VpjyuGDijrYA!2m2!1d-23.32329608991772!2d-52.29632157461903!3f208.5261160452246!4f-0.11605143845567056!5f0.7820865974627469'
        }
    ];

    container.innerHTML = abrigos.map((abrigo, index) => {
        const coordsMatch = abrigo.iframe.match(/!2m2!1d([^!]+)!2d([^!]+)/);
        const lat = coordsMatch ? coordsMatch[1] : '';
        const lng = coordsMatch ? coordsMatch[2] : '';
        
        return `
            <div class="abrigo-card" id="abrigo-card-${index}">
                <div class="abrigo-card-header" onclick="toggleAbrigoCard(${index})">
                    <img src="@image/icones/escola.svg" alt="Abrigo" class="icone">
                    <div style="flex:1;">
                        <strong style="color:var(--text-primary);">${abrigo.nome}</strong>
                        <div style="font-size:0.8rem;color:var(--text-secondary);">${abrigo.endereco}</div>
                    </div>
                    <span class="toggle-icon" id="toggle-icon-${index}">
                        <img src="@image/icones/seta-baixo.svg" alt="Expandir" class="icone">
                    </span>
                </div>
                <div class="abrigo-card-body" id="abrigo-body-${index}">
                    <div class="street-view">
                        <iframe src="${abrigo.iframe}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
                    </div>
                    <div class="info-row"><img src="@image/icones/pessoas.svg" alt="Capacidade" class="icone-peq"><strong>Capacidade:</strong> ${abrigo.capacidade}</div>
                    <div class="info-row"><img src="@image/icones/telefone.svg" alt="Telefone" class="icone-peq"><strong>Contato:</strong> ${abrigo.telefone}</div>
                    <div class="info-row"><img src="@image/icones/pessoa.svg" alt="Responsável" class="icone-peq"><strong>Responsável:</strong> ${abrigo.responsavel}</div>
                    <div class="info-row"><img src="@image/icones/info.svg" alt="Observações" class="icone-peq"><strong>Observações:</strong> ${abrigo.observacoes}</div>
                    <div class="info-row" style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
                        <img src="@image/icones/mapa.svg" alt="Localização" class="icone">
                        <a href="https://www.google.com/maps/dir//${lat},${lng}" target="_blank" rel="noopener noreferrer" style="color:var(--dc-orange);text-decoration:none;">Como chegar →</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    abrigoExpandido = null;
}

function toggleAbrigoCard(index) {
    if (abrigoExpandido !== null && abrigoExpandido !== index) {
        const bodyAnterior = document.getElementById(`abrigo-body-${abrigoExpandido}`);
        const iconAnterior = document.getElementById(`toggle-icon-${abrigoExpandido}`);
        if (bodyAnterior) bodyAnterior.classList.remove('open');
        if (iconAnterior) iconAnterior.classList.remove('open');
    }

    const body = document.getElementById(`abrigo-body-${index}`);
    const icon = document.getElementById(`toggle-icon-${index}`);
    
    if (body) {
        if (body.classList.contains('open')) {
            body.classList.remove('open');
            if (icon) icon.classList.remove('open');
            abrigoExpandido = null;
        } else {
            body.classList.add('open');
            if (icon) icon.classList.add('open');
            abrigoExpandido = index;
        }
    }
}

function fecharTodosAbrigos() {
    document.querySelectorAll('.abrigo-card-body').forEach(body => body.classList.remove('open'));
    document.querySelectorAll('.toggle-icon').forEach(icon => icon.classList.remove('open'));
    abrigoExpandido = null;
}

// ================================================================
// 17. FUNÇÕES DE TESTE (para console)
// ================================================================

window.buscarDadosReais = function() {
    console.log('Buscando dados...');
    fetchInmetAlerts();
    fetchWeatherData();
};

console.log('Script carregado! Use "buscarDadosReais()" para atualizar manualmente.');