🚒 Defesa Civil - Site de Alertas e Informações - Versão 3

	Site institucional para a Defesa Civil municipal, com painel de clima, alertas automáticos, abrigos interativos com Street View e informações de contato.


📋 SOBRE O PROJETO

	Este é um site estático para a Defesa Civil de Floraí/PR, desenvolvido para fornecer informações atualizadas sobre:

		- 🌤️ Clima e previsão do tempo (dados da Open-Meteo)
		- 🌡️ Temperaturas mínima e máxima do dia
		- ⚠️ Alertas automáticos baseados em condições climáticas
		- 🏠 Abrigos interativos com visualização 3D (Google Street View)
		- 📍 Mapa de atendimentos (Google My Maps)
		- 📱 Postagens de orientação com Lightbox
		- 👥 Equipe de coordenação

🆕 NOVIDADES DA VERSÃO 3

	✅ Temperaturas mínima e máxima exibidas no card de clima
	✅ Cards de abrigos expansíveis com visualização 3D (sem API Key)
	✅ Sistema de abrir/fechar apenas um card por vez
	✅ Fechamento automático dos cards ao fechar o modal
	✅ Responsividade melhorada para títulos em dispositivos móveis
	✅ Número de emergência padronizado em todos os modais
	✅ Ícones SVG novos: seta-baixo, pessoas e pessoa

🛠️ TECNOLOGIAS UTILIZADAS

	- HTML5 - Estrutura do site
	- CSS3 - Estilização com suporte a tema claro/escuro
	- JavaScript (Vanilla) - Funcionalidades interativas
	- Open-Meteo API - Dados climáticos em tempo real
	- Google My Maps - Mapa de abrigos
	- Google Street View - Visualização 3D dos abrigos (sem API Key)


📁 ESTRUTURA DE ARQUIVOS

	📁 defesacivil/
	├── index.html        	  # Página principal
	├── style.css         	  # Estilos (com tema claro/escuro)
	├── script.js         	  # Lógica do site (API, modais, tema)
	├── comfortaa.woff2   	  # Fonte do site (opcional)
	├── 📁 @image/        	  # Imagens do site
	│   ├── 📁 icones/    	  # Ícones SVG
	│   ├── 📁 logotipos/ 	  # Logotipos (defciv.svg, florai.png, etc)
	│   └── 📁 perfil/   	  # Imagens de perfil da equipe da defesa civil
	│   └── 📁 posts/   	  # Imagens do Instagram (1.jpg, 2.jpg, etc)
	└── README.md            # Este arquivo

	Obs.: As páginas index.html dentro de outras pastas, servem apenas para 
	redirecionar o acesso para a página principal


🔧 COMO ADAPTAR PARA OUTRO MUNICÍPIO

	Para usar este site em outra cidade, siga os passos abaixo:


	1️⃣ ALTERAR COORDENADAS GEOGRÁFICAS (script.js)

		Localize e altere as variáveis no início do 'script.js':

			javascript
			// ============================================
			// ALTERE AQUI AS COORDENADAS DO SEU MUNICÍPIO
			// ============================================

			const LAT = -23.3178;   // ← Latitude da sua cidade
			const LON = -52.3028;   // ← Longitude da sua cidade
			const TIMEZONE = 'America/Sao_Paulo';  // ← Fuso horário


	💡 Dica: Encontre as coordenadas no Google Maps: clique com o botão 
	direito sobre a cidade → "O que há aqui?" → copie as coordenadas.


	2️⃣ ATUALIZAR CONTEÚDO TEXTUAL

		A) Títulos e textos (index.html)

			html
			<!-- Linha 41 - Título -->
			<span class="logo-text">Defesa Civil de [SUA CIDADE]/[UF]</span>

			<!-- Linha 55 - Título principal -->
			<h1 class="hero-title">Proteção e Defesa Civil - <span>[SUA CIDADE]/[UF]</span></h1>

			<!-- Linha 58 - Subtítulo -->
			<p class="hero-sub">Informações atualizadas sobre clima, alertas e segurança</p>


		B) Redes sociais (index.html)

			html
			<!-- Linha 88 - Link do Instagram -->
			<a href="https://www.instagram.com/[SEU_INSTAGRAM]">@[SEU_INSTAGRAM]</a>

			<!-- Linha 110 - Link do Instagram (rodapé) -->
			<a href="https://www.instagram.com/[SEU_INSTAGRAM]/" target="_blank">
 			   Avisos no Instagram
			</a>


		C) Abrigos com Street View (script.js)

		Edite a lista de abrigos na função `renderAbrigos()`:

			javascript
			const abrigos = [
			    {
			        nome: 'NOME DO ABRIGO',
			        endereco: 'RUA, NÚMERO',
			        capacidade: 'XX pessoas',
			        telefone: '(XX) XXXX-XXXX',
			        observacoes: 'Descrição do abrigo (região, características)',
			        responsavel: 'Nome do responsável',
			        iframe: 'LINK DO GOOGLE MAPS STREET VIEW'
			    },
			    // REPITA PARA CADA ABRIGO
			];

			📌 Como obter o iframe do abrigo:
			1. Abra o Google Maps e encontre o local do abrigo
			2. Clique no ícone de "Street View" (bonequinho amarelo)
			3. Posicione a câmera no ângulo desejado
			4. Clique no menu (três pontos) → "Compartilhar" → "Incorporar mapa"
			5. Copie o link do iframe (ex: https://www.google.com/maps/embed?pb=!4v...)


		D) Contato (index.html - Modal)

		Atualize as informações de contato (linhas 251-270):

			html
			<strong>Emergência</strong>
			<div style="color:var(--text-secondary);">199</div>

			<strong>Telefone</strong>
			<div style="color:var(--text-secondary);">(44) 3242-8300</div>

			<strong>E-mail</strong>
			<div style="color:var(--text-secondary);">defesacivil@florai.pr.gov.br</div>

			<strong>Endereço</strong>
			<div style="color:var(--text-secondary);">Rua Getulio Vargas, 177 - Centro - Floraí/PR</div>


		E) Equipe (index.html - Modal)

		Edite os membros da equipe (linhas 238-248):

			html
			<div class="team-member">
			    <img class="team-avatar" src="@image/perfil/1.svg" alt="Foto do Perfil">
			    <h4>NOME DO MEMBRO</h4>
			    <p>CARGO/FUNÇÃO</p>
			</div>
			<!-- REPITA PARA CADA MEMBRO -->


	3️⃣ SUBSTITUIR IMAGENS

			Substitua os arquivos na pasta `@image/`:

				Arquivo 						Onde é usado			Descrição

				@image/logotipos/florai.png 	Navbar 					Brasão da cidade
				@image/logotipos/defciv.svg 	Navbar, Hero, Modal		Logo da Defesa Civil
				@image/logotipos/simepar.png 	Links					Logo do SIMEPAR
				@image/logotipos/inmet.png 		Links 					Logo do INMET
				@image/logotipos/instagram.png 	Links 					Logo do Instagram
				@image/perfil/1.svg 			Equipe 					Fotos dos membros
				@image/posts/1.jpg a 4.jpg 		Instagram Grid 			Postagens de orientação
				@image/wallpaper.jpg 			Fundo 					Imagem de fundo do site

			Certifique-se de criar ou baixar os seguintes ícones SVG:

				Arquivo 						Onde é usado			Descrição
 
				seta-baixo.svg					Seta para baixo			Toggle dos cards de abrigo
				pessoas.svg						Grupo de pessoas		Capacidade dos abrigos
				pessoa.svg						Mãos de ajuda			Responsável do abrigo


	4️⃣ ATUALIZAR MAPA (index.html)

			Troque o ID do mapa do Google Maps (linha 118):

				html
				<iframe src="https://www.google.com/maps/d/embed?mid=[SEU_MAPA_ID]&ehbc=2E312F&noprof=1" 
 					allowfullscreen loading="lazy">
				</iframe>

			💡 Dica para criar seu mapa:
            Acesse Google My Maps → crie seu mapa → compartilhar → incorporar no site.


	5️⃣ INFORMAÇÕES NO RODAPÉ (index.html)

		Mantenha as informações como estão, o uso desse código é livre, mas mantenha a atribuição do desenvolvedor


🎨 TEMAS (CLARO/ESCURO)

	O site já possui suporte nativo a temas claro e escuro:

		- Botão de alternância: Canto superior direito (ícone de lua/sol)
		- Atalho: Tecla `M` no teclado
		- Persistência: A preferência é salva no `localStorage`


	Para personalizar as cores, edite as variáveis CSS no 'style.css':

		css
		:root {
		    / Tema claro /
		    --dc-orange: #FAA954;      / Cor principal da Defesa Civil /
		    --bg-glass: rgba(254, 254, 254, 0.92);
		    --text-primary: #2C2420;
		    / ... /
		}

		[data-theme="dark"] {
		    / Tema escuro /
		    --bg-glass: rgba(30, 28, 40, 0.92);
		    --text-primary: #F0ECE8;
		    / ... /
		}


🚀 ATALHOS DE TECLADO

	Tecla	Ação
	
	ESC	Fecha modais e lightbox
	M	Alterna tema claro/escuro
	← →	Navega no lightbox de imagens


📦 COMO USAR

	1. Baixe ou clone o repositório
	2. Adapte as informações para seu município (veja seção acima)
	3. Substitua as imagens na pasta @image/
	4. Hospede em qualquer servidor web (pode ser GitHub Pages, Vercel, Netlify, etc)
	5. Pronto! O site está no ar 🚀


⚙️ DEPENDÊNCIAS EXTERNAS

	O site depende apenas de:

		Recurso		Descrição

		Open-Meteo API		Dados climáticos (gratuito, sem chave)
		Google Maps 		Cadastros personalizados de locais no My Maps
		Google Street View	Embed para visualização 3D dos abrigos (sem API Key)

	⚠️ IMPORTANTE: O sistema de Street View NÃO requer API Key do Google. 
	Usamos iframes estáticos do Google Maps Embed.


📄 LICENÇA

	Este projeto está sob a licença GNU GPLv3 - livre para uso, modificação e distribuição.


💬 DÚVIDAS E CONTATO

	Para sugestões, dúvidas ou contribuições:

		- 📧 Email: suporte@ghenrique.com.br
		- 🐙 GitHub: /thegui44


Desenvolvido com ❤️ Defesa Civil #SomosTodosNós