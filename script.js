// ============================================
// 1. TEMA
// ============================================

const html = document.documentElement;
const themeToggleDesktop = document.getElementById("theme-toggle-desktop");
const themeToggleMobile = document.getElementById("theme-toggle-mobile");
const themeIconDesktop = document.getElementById("theme-icon-desktop");
const themeIconMobile = document.getElementById("theme-icon-mobile");

function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    const iconPath = theme === 'light' ? '@image/icones/lua.svg' : '@image/icones/sol.svg';
    const altText = theme === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro';
    if (themeIconDesktop) { themeIconDesktop.src = iconPath; themeIconDesktop.alt = altText; }
    if (themeIconMobile) { themeIconMobile.src = iconPath; themeIconMobile.alt = altText; }
}

if (themeToggleDesktop) themeToggleDesktop.addEventListener("click", toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener("click", toggleTheme);

// ============================================
// 2. MODAIS
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Fechar modal ao clicar fora do conteúdo (backdrop)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ============================================
// 3. NAVEGAÇÃO MOBILE
// ============================================

function setupMobileNavigation() {
    const hamburger = document.getElementById("hamburger-btn");
    const navMenu = document.querySelector(".nav-menu");

    function toggleMenu() {
        navMenu.classList.toggle("active");
        if (hamburger) {
            const icon = hamburger.querySelector('img');
            if (icon) {
                icon.src = navMenu.classList.contains("active") ?
                    '@image/icones/close.svg' :
                    '@image/icones/menu.svg';
            }
        }
    }

    if (hamburger) {
        hamburger.addEventListener("click", function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }

    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') &&
            !e.target.closest('.navbar')) {
            navMenu.classList.remove("active");
            if (hamburger) {
                const icon = hamburger.querySelector('img');
                if (icon) icon.src = '@image/icones/menu.svg';
            }
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove("active");
                if (hamburger) {
                    const icon = hamburger.querySelector('img');
                    if (icon) icon.src = '@image/icones/menu.svg';
                }
            }
        }
    });
}

// ============================================
// 4. EQUIPE - PREENCHIMENTO DINÂMICO
// ============================================

function renderTeam() {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;
    const members = [
        { name: 'José Antonio', role: 'Coordenador' },
        { name: 'Andrei Barbosa', role: 'Secretário' },
        { name: 'Guilherme Henrique', role: 'Diretor Operacional' },
    ];

    grid.innerHTML = members.map(m => `
        <div class="team-member">
            <div class="team-avatar">
                <img src="@image/logotipos/defciv.svg" alt="${m.name}" class="team-avatar-icon">
            </div>
            <h4>${m.name}</h4>
            <p>${m.role}</p>
        </div>
    `).join('');
}

// ============================================
// VARIÁVEIS DO LIGHTBOX
// ============================================

let lightboxImages = [];
let currentLightboxIndex = 0;

// ============================================
// RENDER INSTAGRAM COM LIGHTBOX
// ============================================

function renderInstagram() {
    const grid = document.getElementById('instagramGrid');
    if (!grid) return;
    
    const posts = [
        { 
            image: '@image/posts/1.jpg',
            label: 'Limpeza de Calhas'
        },
        { 
            image: '@image/posts/2.jpg',
            label: 'Alertas por SMS'
        },
        { 
            image: '@image/posts/3.jpg',
            label: 'Limpeza de Bueiros'
        },
        { 
            image: '@image/posts/4.jpg',
            label: 'Destelhamentos'
        },
    ];
    
    lightboxImages = posts;
    
    grid.innerHTML = posts.map((p, index) => `
        <div class="insta-item" onclick="openLightbox(${index})" style="cursor:pointer;">
            <img 
                src="${p.image}" 
                alt="${p.label}" 
                loading="lazy"
                style="width:100%;height:100%;object-fit:cover;"
                onerror="this.style.display='none'"
            >
            <div class="insta-overlay">
                Clique para ampliar
            </div>
        </div>
    `).join('');
}

// ============================================
// FUNÇÕES DO LIGHTBOX
// ============================================

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

// Fechar lightbox ao clicar no overlay (fora do conteúdo)
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active') && e.target === lightbox) {
        closeLightbox();
    }
});

// ============================================
// 6. INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Defesa Civil - Site Inicializado');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
    } else {
        const currentTheme = html.getAttribute('data-theme') || 'light';
        updateThemeIcons(currentTheme);
    }

    renderTeam();
    renderInstagram();
    setupMobileNavigation();

    console.log('Iniciando busca de dados climáticos (Open-Meteo)...');
    fetchWeatherAndAlerts();
    
    setInterval(fetchWeatherAndAlerts, 300000);

    console.log('Defesa Civil - Pronto!');
});

// ============================================
// 7. ATALHOS DE TECLADO
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
        closeLightbox();
    }
    if (e.key === 'm' || e.key === 'M') {
        toggleTheme();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            const direction = e.key === 'ArrowLeft' ? -1 : 1;
            changeLightboxImage(direction);
            e.preventDefault();
        }
    }
});

console.log('Defesa Civil - Proteção e Prevenção');
console.log('Atalhos: ESC fecha modais | M alterna tema | ← → navega no lightbox');

// ============================================
// API DO CLIMA - OPEN-METEO
// ============================================

const LAT = -23.3178;
const LON = -52.3028;
const TIMEZONE = 'America/Sao_Paulo';

const WEATHER_CODES = {
    0: { description: 'Céu limpo', emoji: 'sol.svg' },
    1: { description: 'Predominantemente limpo', emoji: 'sol-nuvem.svg' },
    2: { description: 'Parcialmente nublado', emoji: 'nuvem-sol.svg' },
    3: { description: 'Nublado', emoji: 'nuvem.svg' },
    45: { description: 'Nevoeiro', emoji: 'nevoeiro.svg' },
    48: { description: 'Nevoeiro com geada', emoji: 'nevoeiro.svg' },
    51: { description: 'Garoa fina', emoji: 'chuva-fraca.svg' },
    53: { description: 'Garoa moderada', emoji: 'chuva-fraca.svg' },
    55: { description: 'Garoa forte', emoji: 'chuva.svg' },
    61: { description: 'Chuva fraca', emoji: 'chuva.svg' },
    63: { description: 'Chuva moderada', emoji: 'chuva.svg' },
    65: { description: 'Chuva forte', emoji: 'chuva.svg' },
    71: { description: 'Neve fraca', emoji: 'neve.svg' },
    73: { description: 'Neve moderada', emoji: 'neve.svg' },
    75: { description: 'Neve forte', emoji: 'neve.svg' },
    77: { description: 'Grãos de neve', emoji: 'neve.svg' },
    80: { description: 'Chuvisco fraco', emoji: 'chuva-fraca.svg' },
    81: { description: 'Chuvisco moderado', emoji: 'chuva.svg' },
    82: { description: 'Chuvisco forte', emoji: 'chuva.svg' },
    85: { description: 'Neve fraca', emoji: 'neve.svg' },
    86: { description: 'Neve forte', emoji: 'neve.svg' },
    95: { description: 'Tempestade fraca', emoji: 'tempestade.svg' },
    96: { description: 'Tempestade com granizo', emoji: 'tempestade.svg' },
    99: { description: 'Tempestade com granizo forte', emoji: 'tempestade.svg' }
};

function getWeatherInfo(code) {
    return WEATHER_CODES[code] || { description: 'Condição desconhecida', emoji: 'interrogacao.svg' };
}

function getWeatherSVG(emoji) {
    return `@image/icones/${emoji}`;
}

// ============================================
// FUNÇÃO: BUSCAR DADOS DA OPEN-METEO
// ============================================

async function fetchWeatherAndAlerts() {
    console.log('Buscando dados do Open-Meteo...');
    
    const weatherIcon = document.getElementById('weather-icon');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherCity = document.getElementById('weather-city');
    
    if (weatherIcon) weatherIcon.innerHTML = `<img src="@image/icones/tempo.svg" alt="Carregando" class="weather-emoji">`;
    if (weatherTemp) weatherTemp.innerHTML = `<img src="@image/icones/update.svg" alt="Carregando" class="icone">`;
    if (weatherCity) weatherCity.innerText = "Carregando...";
    
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&timezone=${TIMEZONE}&forecast_days=3`;
        
        console.log('URL:', url);
        
        const response = await fetch(url);
        console.log('Status HTTP:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        processarDadosClima(data);
        
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        mostrarErro(error.message);
    }
}

// ============================================
// FUNÇÃO: PROCESSAR DADOS DO CLIMA
// ============================================

function processarDadosClima(data) {
    console.log('Processando dados do clima...');
    
    const current = data.current || {};
    const daily = data.daily || {};
    
    if (!current || current.temperature_2m === undefined) {
        throw new Error('Dados de clima inválidos');
    }
    
    const temperature = Math.round(current.temperature_2m || 0);
    const feelsLike = Math.round(current.apparent_temperature || 0);
    const humidity = Math.round(current.relative_humidity_2m || 0);
    const windSpeed = Math.round(current.wind_speed_10m || 0);
    const windGusts = Math.round(current.wind_gusts_10m || 0);
    const precipitation = Math.round((current.precipitation || 0) * 10) / 10;
    const weatherCode = current.weather_code || 0;
    const weatherInfo = getWeatherInfo(weatherCode);
    
    console.log('Clima atual:', { temperature, weatherInfo, windSpeed, humidity, precipitation });

    const cityEl = document.getElementById('weather-city');
    const tempEl = document.getElementById('weather-temp');
    const humidityEl = document.getElementById('weather-humidity');
    const windEl = document.getElementById('weather-wind');
    const feelsEl = document.getElementById('weather-feels');
    const iconEl = document.getElementById('weather-icon');
    const updatedEl = document.getElementById('weather-updated');
    
    if (cityEl) cityEl.innerText = "Floraí/PR";
    if (tempEl) tempEl.innerHTML = `${temperature} <small>°C</small>`;
    if (humidityEl) humidityEl.innerText = `${humidity}%`;
    if (windEl) {
        windEl.innerText = windGusts > 0 ? 
            `${windSpeed} km/h (rajadas ${windGusts} km/h)` : 
            `${windSpeed} km/h`;
    }
    if (feelsEl) feelsEl.innerText = `${feelsLike}°C`;

    if (iconEl) {
        const svgPath = getWeatherSVG(weatherInfo.emoji);
        iconEl.innerHTML = `<img src="${svgPath}" alt="${weatherInfo.description}" class="weather-emoji">`;
    }

    const now = new Date();
    if (updatedEl) {
        updatedEl.innerHTML = `
            ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        `;
    }

    const alerts = gerarAlertas(current, daily);
    console.log(`${alerts.length} alerta(s) gerado(s)`);
    
    const alertCard = document.getElementById('alert-card');
    const alertHeadline = document.getElementById('alert-headline');
    const alertDescription = document.getElementById('alert-description');
    const alertPeriod = document.getElementById('alert-period');

    function updateAlertCard(level, title, description, periodText = null) {
        if (alertCard) {
            alertCard.className = `dashboard-card alert-${level}`;
        }
        if (alertHeadline) alertHeadline.innerHTML = title;
        if (alertDescription) alertDescription.innerHTML = description;
        if (alertPeriod) {
            if (periodText) {
                alertPeriod.style.display = 'block';
                alertPeriod.innerHTML = `<img src="@image/icones/relogio.svg" alt="Relógio" class="icone-peq"> ${periodText}`;
            } else {
                alertPeriod.style.display = 'none';
            }
        }
    }

    if (alerts.length > 0) {
        const alerta = alerts[0];
        const severity = alerta.severity || 'warning';
        const levelMap = {
            'extreme': 'danger',
            'severe': 'danger',
            'warning': 'warning',
            'info': 'normal'
        };
        const level = levelMap[severity] || 'warning';
        
        const alertIcon = alerta.emoji ? getWeatherSVG(alerta.emoji) : '@image/icones/alerta.svg';
        
        updateAlertCard(
            level,
            `<img src="${alertIcon}" alt="${alerta.event}" class="alert-icon"> ${alerta.event || 'Alerta'}`,
            alerta.description || 'Alerta emitido pelo sistema.',
            alerta.period || null
        );
    } else {
        updateAlertCard(
            'normal',
            `<img src="@image/icones/check.svg" alt="Normal" class="alert-icon"> Condições Normais`,
            `<img src="${getWeatherSVG(weatherInfo.emoji)}" alt="${weatherInfo.description}" class="weather-emoji" style="width:24px;height:24px;"> ${weatherInfo.description} - Sem riscos iminentes. Acompanhe nossas orientações no Instagram: @defesacivilflorai`,
            null
        );
    }

    atualizarModalAlertas(current, daily, alerts);
}

// ============================================
// FUNÇÃO: GERAR ALERTAS AUTOMÁTICOS
// ============================================

function gerarAlertas(current, daily) {
    const alerts = [];
    
    const windSpeed = current.wind_speed_10m || 0;
    const windGusts = current.wind_gusts_10m || 0;
    const weatherCode = current.weather_code || 0;
    const precipitation = current.precipitation || 0;
    const rain = current.rain || 0;
    const showers = current.showers || 0;
    
    if (windSpeed > 50 || windGusts > 70) {
        alerts.push({
            event: 'VENTOS FORTES',
            description: `Ventos de ${windSpeed} km/h com rajadas de ${windGusts} km/h. Risco de queda de árvores, destelhamentos e objetos soltos.`,
            severity: 'severe',
            emoji: 'tornado.svg',
            period: 'Evite áreas abertas'
        });
    }
    
    if ([95, 96, 99].includes(weatherCode)) {
        alerts.push({
            event: 'TEMPESTADE',
            description: 'Tempestade com raios e ventos fortes. Evite áreas abertas, não se abrigue debaixo de árvores e mantenha-se em local seguro.',
            severity: 'severe',
            emoji: 'tempestade.svg',
            period: 'Busque abrigo seguro'
        });
    }
    
    if (rain > 10 || showers > 10 || precipitation > 15) {
        alerts.push({
            event: 'CHUVA INTENSA',
            description: `Precipitação de ${Math.round(precipitation * 10) / 10}mm. Risco de alagamentos e enxurradas. Evite transitar em áreas de risco.`,
            severity: 'warning',
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
                    description: `Previsão de chuva forte para ${dateStr} com ${Math.round(dayProb)}% de probabilidade e acumulado de ${Math.round(dayPrecip)}mm. Prepare-se com antecedência.`,
                    severity: 'warning',
                    emoji: 'calendario.svg',
                    period: `Fique atento para ${dateStr}`
                });
                break;
            }
            
            if (dayWind > 60) {
                const date = new Date(dayDate + 'T00:00:00');
                const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                alerts.push({
                    event: 'VENTOS FORTES PREVISTOS',
                    description: `Ventos de até ${Math.round(dayWind)} km/h previstos para ${dateStr}. Atenção redobrada.`,
                    severity: 'warning',
                    emoji: 'calendario.svg',
                    period: `Fique atento para ${dateStr}`
                });
                break;
            }
        }
    }
    
    return alerts.slice(0, 3);
}

// ============================================
// FUNÇÃO: MOSTRA ERRO NA INTERFACE
// ============================================

function mostrarErro(mensagem) {
    const cityEl = document.getElementById('weather-city');
    const tempEl = document.getElementById('weather-temp');
    const iconEl = document.getElementById('weather-icon');
    const humidityEl = document.getElementById('weather-humidity');
    const windEl = document.getElementById('weather-wind');
    const feelsEl = document.getElementById('weather-feels');
    const updatedEl = document.getElementById('weather-updated');
    
    if (cityEl) cityEl.innerText = "Floraí/PR";
    if (tempEl) tempEl.innerHTML = `-- <small>°C</small>`;
    if (humidityEl) humidityEl.innerText = '--%';
    if (windEl) windEl.innerText = '-- km/h';
    if (feelsEl) feelsEl.innerText = '--°C';
    if (iconEl) {
        iconEl.innerHTML = `<img src="@image/icones/nuvem.svg" alt="Indisponível" class="weather-emoji">`;
    }
    if (updatedEl) updatedEl.innerText = new Date().toLocaleString('pt-BR');
    
    const alertCard = document.getElementById('alert-card');
    if (alertCard) {
        alertCard.className = "dashboard-card alert-normal";
        const headline = document.getElementById('alert-headline');
        const desc = document.getElementById('alert-description');
        const period = document.getElementById('alert-period');
        
        if (headline) headline.innerHTML = `<img src="@image/icones/alerta.svg" alt="Alerta" class="alert-icon"> Serviço Indisponível`;
        if (desc) desc.innerText = `Erro: ${mensagem}. Em caso de emergência, ligue 199.`;
        if (period) period.style.display = 'none';
    }
    
    const painel = document.getElementById("painel-alertas");
    if (painel) {
        painel.innerHTML = `
            <div style="border: 1px solid #ffcccc; background: #fff5f5; color: #cc0000; padding: 20px; border-radius: 8px; text-align:center;">
                <img src="@image/icones/exclamacao.svg" alt="Erro" style="width:32px;height:32px;display:block;margin:0 auto 10px;">
                <h3>Sistema Temporariamente Indisponível</h3>
                <p style="margin:8px 0;"><strong>Erro:</strong> ${mensagem}</p>
                <p style="font-size:0.8rem;color:#888;margin:8px 0;">Em caso de emergência, ligue <strong>199</strong></p>
                <button onclick="fetchWeatherAndAlerts()" style="margin-top:10px;padding:10px 24px;background:#faa954;border:none;border-radius:6px;cursor:pointer;font-weight:bold;color:#fff;">
                    <img src="@image/icones/update.svg" alt="Tentar" style="width:16px;height:16px;vertical-align:middle;"> Tentar novamente
                </button>
            </div>
        `;
    }
}

// ============================================
// FUNÇÃO: ATUALIZA MODAL COM PREVISÃO
// ============================================

function atualizarModalAlertas(current, daily, alerts) {
    const painel = document.getElementById("painel-alertas");
    if (!painel) return;
    
    if (!current || current.temperature_2m === undefined) {
        painel.innerHTML = `<p style="text-align:center;padding:20px;color:#888;">Dados indisponíveis</p>`;
        return;
    }
    
    const weatherCode = current.weather_code || 0;
    const weatherInfo = getWeatherInfo(weatherCode);
    const temperature = Math.round(current.temperature_2m || 0);
    const feelsLike = Math.round(current.apparent_temperature || 0);
    const humidity = Math.round(current.relative_humidity_2m || 0);
    const windSpeed = Math.round(current.wind_speed_10m || 0);
    const windGusts = Math.round(current.wind_gusts_10m || 0);
    const precipitation = Math.round((current.precipitation || 0) * 10) / 10;

    let html = '';

    if (alerts && alerts.length > 0) {
        html += `<div style="margin-bottom:16px;">`;
        html += `<h3 style="color:var(--dc-orange);margin-bottom:12px;">
            <img src="@image/icones/alerta.svg" alt="Alertas" style="width:24px;height:24px;vertical-align:middle;"> Alertas Ativos
        </h3>`;
        
        alerts.forEach((alerta) => {
            const severityClass = alerta.severity === 'severe' || alerta.severity === 'extreme' ? 
                'severidade-extreme' : 'severidade-severe';
            const alertIcon = alerta.emoji ? getWeatherSVG(alerta.emoji) : '@image/icones/alerta.svg';
            
            html += `
                <div class="alerta-card ${severityClass}" style="padding: 16px; border-radius: 8px; color: #fff; margin-bottom: 12px;">
                    <h4 style="margin-top: 0; font-size: 1.1rem; color;">
                        <img src="${alertIcon}" alt="${alerta.event}" style="width:24px;height:24px;vertical-align:middle;"> ${alerta.event || 'Alerta'}
                    </h4>
                    <p style="margin: 8px 0; font-size: 0.95rem;">${alerta.description || ''}</p>
                    ${alerta.period ? `<p style="margin: 4px 0; font-size: 0.85rem; opacity: 0.9; color: #fff;">${alerta.period}</p>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    html += `
        <div style="background:var(--card-bg);border-radius:8px;padding:16px;margin-bottom:12px;">
            <h3 style="margin:0 0 8px 0;color:var(--text-primary);">
                <img src="@image/icones/sol-nuvem.svg" alt="Clima" style="width:24px;height:24px;vertical-align:middle;"> Clima Atual
            </h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.9rem;color:var(--text-primary);">
                <div><strong>Temperatura:</strong> ${temperature}°C</div>
                <div><strong>Sensação:</strong> ${feelsLike}°C</div>
                <div><strong>Umidade:</strong> ${humidity}%</div>
                <div><strong>Condição:</strong> <img src="${getWeatherSVG(weatherInfo.emoji)}" alt="${weatherInfo.description}" style="width:20px;height:20px;vertical-align:middle;"> ${weatherInfo.description}</div>
                <div><strong>Precipitação:</strong> ${precipitation} mm</div>
                <div><strong>Vento:</strong> ${windSpeed} km/h ${windGusts > 0 ? `(rajadas ${windGusts} km/h)` : ''}</div>
            </div>
        </div>
    `;

    if (daily.time && daily.time.length > 0) {
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
                    <div style="font-size:0.85rem;font-weight:bold;">
                        ${tempMax}° / ${tempMin}°
                    </div>
                    <div style="font-size:0.7rem;color:var(--text-secondary);">
                        ${prob > 0 ? `${prob}%` : ''}
                        ${precip > 0 ? ` ${precip}mm` : ''}
                    </div>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
    }

    html += `
        <div style="padding:12px;background:rgba(250,169,84,0.1);border-radius:8px;text-align:center;font-size:0.85rem;color:var(--text-secondary);">
            <img src="@image/icones/telefone.svg" alt="Telefone" style="width:16px;height:16px;vertical-align:middle;"> 
            Emergência: <strong>199</strong> | Defesa Civil: (44) 3242-8300
            <br>
            <small style="opacity:0.7;">Dados fornecidos por Open-Meteo</small>
        </div>
    `;

    painel.innerHTML = html;
}

// ============================================
// FUNÇÕES DE TESTE
// ============================================

window.buscarDadosReais = function() {
    console.log('Buscando dados...');
    fetchWeatherAndAlerts();
};