// ============================================================================
// 📁 header.js v5.1 — Graciliano Tolentino
// ✨ Modular • Seguro • Multilíngue • Acessível • High-Tech • 12/10 Ready
// ============================================================================

// 📌 Utilitário de armazenamento seguro
function salvarIdioma(langCode) {
  try {
    localStorage.setItem("idiomaPreferido", langCode);
  } catch (e) {
    console.warn("localStorage indisponível:", e);
  }
}

// 🌐 Alternância segura de idioma com ARIA
function setIdiomaAtivo(langCode) {
  salvarIdioma(langCode);

  document.querySelectorAll('.idioma').forEach((btn) => {
    const ativo = btn.lang === langCode;
    btn.setAttribute('aria-pressed', ativo);
    btn.classList.toggle('ativo', ativo);
  });

  console.log(`Idioma definido para: ${langCode}`);
}

// 🌐 Detecção inicial de idioma com fallback explícito
function detectarIdiomaInicial() {
  const preferido = localStorage.getItem("idiomaPreferido");
  const navegador = (navigator.language || 'pt-BR').toLowerCase();
  const langCode = preferido || (navegador.startsWith('en') ? 'en' : 'pt-BR');
  setIdiomaAtivo(langCode);
}

// 🛡️ Verificação inicial de compatibilidade cross-browser
function verificarCompatibilidade() {
  if (!('querySelector' in document && 'addEventListener' in window)) {
    console.warn('Navegador incompatível com funcionalidades essenciais.');
  }
}

// ============================================================================
// ♿ Navegação otimizada por teclado (ARIA, tabindex, accesskey)
// ============================================================================

// 📌 Marcação dinâmica do link atual com precisão aumentada
function marcarLinkAtual() {
  const urlAtual = window.location.pathname;
  document.querySelectorAll("nav a[href]").forEach(link => {
    if (urlAtual === link.getAttribute("href")) {
      link.setAttribute("aria-current", "page");
      link.classList.add("ativo");
    }
  });
}

// 📱 Controle avançado do menu mobile (<details>)
function configurarMenuMobile() {
  const menuMobile = document.querySelector(".menu-mobile");
  if (menuMobile) {
    menuMobile.setAttribute("aria-expanded", menuMobile.open);
    menuMobile.addEventListener("toggle", () => {
      const estado = menuMobile.open ? 'expandido' : 'recolhido';
      menuMobile.setAttribute("aria-expanded", menuMobile.open);
      console.log(`Menu mobile ${estado}`);
    });
  }
}

// ⌨️ Atalhos de teclado com suporte robusto e feedback visual
function registrarAtalhosTeclado() {
  const mapaAtalhos = {
    "1": "#formacao",
    "2": "#experiencia",
    "3": "#contato",
    "4": ".perfil"
  };

  document.addEventListener("keydown", (e) => {
    if (e.altKey && mapaAtalhos[e.key]) {
      e.preventDefault();
      const elementoAlvo = document.querySelector(mapaAtalhos[e.key]);
      if (elementoAlvo) {
        elementoAlvo.setAttribute('tabindex', '-1'); // Temporário para acessibilidade
        elementoAlvo.focus({ preventScroll: false });
        elementoAlvo.scrollIntoView({ behavior: "smooth", block: "center" });
        console.log(`Atalho Alt+${e.key} ativado.`);
      }
    }
  });
}

// 🎯 Foco visual programável aprimorado para leitores de tela
function aplicarTabindexProgramavel() {
  document.querySelectorAll('[aria-labelledby]').forEach(el => {
    el.setAttribute("tabindex", "0");
  });

  // Feedback visual de foco aprimorado
  document.addEventListener('focusin', (e) => {
    e.target.classList.add('foco-visivel');
  });

  document.addEventListener('focusout', (e) => {
    e.target.classList.remove('foco-visivel');
  });
}

// ============================================================================
// 🚀 Inicialização segura, inteligente e monitoramento de performance
// ============================================================================

// 📈 Monitoramento avançado de performance (High-Tech Monitoring)
function monitorarPerformance() {
  if ('performance' in window) {
    const tempoDeCarga = performance.now().toFixed(2);
    console.log(`🚀 Página carregada em ${tempoDeCarga}ms`);

    const recursos = performance.getEntriesByType('resource');
    recursos.forEach(recurso => {
      if (recurso.duration > 100) { // Threshold otimizado para recursos lentos
        console.warn(`⚠️ Recurso lento: ${recurso.name} carregado em ${recurso.duration.toFixed(2)}ms`);
      }
    });
  }
}

// 🛡️ Tratamento robusto de erros com logging inteligente
function configurarTratamentoErros() {
  window.addEventListener('error', (evento) => {
    console.error(`🚨 Erro capturado: ${evento.message}`, evento.filename, evento.lineno, evento.colno);
  });

  window.addEventListener('unhandledrejection', (evento) => {
    console.error(`🚨 Promessa rejeitada sem tratamento:`, evento.reason);
  });
}

// ✅ Inicialização geral High-Tech: execução segura, sequencial e completa
window.addEventListener("DOMContentLoaded", () => {
  try {
    console.group("🔄 Inicialização do Header.js");
    
    detectarIdiomaInicial();
    marcarLinkAtual();
    configurarMenuMobile();
    registrarAtalhosTeclado();
    aplicarTabindexProgramavel();
    monitorarPerformance();
    configurarTratamentoErros();
    
    console.log("✅ Header.js inicializado com sucesso.");
  } catch (erro) {
    console.error("🚨 Erro na inicialização:", erro);
  } finally {
    console.groupEnd();
  }
});
