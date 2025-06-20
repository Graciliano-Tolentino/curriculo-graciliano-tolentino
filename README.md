# 📄 Currículo Oficial — Graciliano Tolentino

> **Currículo digital multilíngue, acessível, responsivo e seguro.**  
> Desenvolvido com foco em performance, SEO avançado, PWA instalável e proteção contra raspagem por inteligência artificial.

---

## ✅ Descrição

Este projeto é o currículo digital oficial de **Graciliano Tolentino**, desenvolvido como uma **Progressive Web App (PWA)** moderna e multilíngue (🇧🇷 Português e 🇺🇸 Inglês), com foco em:

- Acessibilidade
- SEO internacionalizado
- Rastreabilidade controlada
- Compatibilidade mobile-first
- Interface estática com recursos dinâmicos JS

Disponível para visualização, impressão ou instalação como app em qualquer dispositivo.

---

## 🧠 Recursos implementados

| Funcionalidade                        | Descrição técnica                                                                 |
|--------------------------------------|----------------------------------------------------------------------------------|
| 🌐 Multilíngue                        | Arquivos `index.html` (PT-BR) e `index-en.html` (EN) com redirecionamento automático |
| 📱 PWA + Manifest + Service Worker   | Instalação como app offline com fallback e cache inteligente                     |
| 🔒 Antisscraping por IA              | Bloqueio de bots como GPTBot, ClaudeBot, ChatGPT-User via `robots.txt`           |
| 📸 SEO com hreflang + canonical      | Otimizado para Google, Bing, Yandex com sitemap multilíngue e metatags estratégicas |
| 📜 HTML semântico + ARIA             | Estrutura acessível com roles e descrição para leitores de tela                  |
| 🌙 Tema dinâmico e responsivo        | Alternância automática entre dark/light com persistência                         |
| 🧭 Sitemap dividido e automatizado   | `sitemap.xml`, `sitemap-pt.xml`, `sitemap-en.xml`, `sitemap-index.xml`           |

---

## 🛠️ Como clonar e usar

### 🧾 Requisitos

- Navegador moderno (Chrome, Edge, Firefox, Safari)
- Git instalado localmente

### 📥 Clonar o repositório

```bash
git clone https://github.com/Graciliano-Tolentino/curriculo-graciliano-tolentino.git
cd curriculo-graciliano-tolentino
````

### ▶️ Executar localmente

Você pode abrir diretamente o arquivo `index.html` no navegador (recomendado usar servidor local para Service Worker):

```bash
# Instalar dependência para servir arquivos (opcional)
npm install -g serve

# Rodar localmente
serve .
```

### 🚀 Publicar no GitHub Pages

1. Vá até o repositório
2. Acesse **Settings > Pages**
3. Escolha a branch `main` e pasta `/root`
4. Clique em **Save**

---

## 📁 Estrutura de Arquivos

```bash
curriculo-graciliano-tolentino/
├── index.html
├── index-en.html
├── offline.html
├── manifest.json
├── robots.txt
├── sitemap.xml
├── sitemap-pt.xml
├── sitemap-en.xml
├── sitemap-index.xml
├── service-worker.js
├── assets/
│   └── css/
│       ├── base.css
│       ├── footer.css
│       ├── header.css
│       └── carrossel.css
├── partials/
│   ├── header.html
│   └── footer.html
└── scripts/
    ├── includes.js
    ├── footer-loader.js
    ├── lang-redirect.js
    └── carrossel.js
```

---

## ⚖️ Licença

Distribuído sob a licença **MIT**.
Você pode utilizar este projeto como base para seu próprio currículo, com os devidos créditos.

---

## 🙋‍♂️ Autor

**Graciliano Tolentino**
🔗 [gracilianotolentino.org](https://gracilianotolentino.org)
📧 [gracilianotolentino@gmail.com](mailto:gracilianotolentino@gmail.com)

---

## 💎 Sabedoria • Força • Beleza

> Software não é apenas funcional. É também forma de expressão.
> Este currículo foi feito para ser admirado, estudado e expandido.

