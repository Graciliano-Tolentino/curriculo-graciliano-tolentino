// ============================================================================================
// 🔻 footer-loader.js v4.0 — Rodapé Inteligente com Tema `"auto"`, Idioma Dinâmico, SPA-aware
// 🌐 Acessível • Persistente • Observável • Extensível — Desenvolvido com sabedoria, força e beleza
// ============================================================================================

document.addEventListener("DOMContentLoaded", () => {
  // 📅 Atualiza automaticamente o ano
  try {
    const anoEl = document.querySelector(".ano-atual");
    if (anoEl) anoEl.textContent = new Date().getFullYear();
  } catch (e) {
    console.warn("⚠️ Falha ao atualizar o ano.", e);
  }

  // 🌐 Marcação de idioma ativo + mudança dinâmica
  const idiomaLinks = document.querySelectorAll(".idioma-link");
  const currentPath = window.location.pathname.toLowerCase();

  const getLang = () =>
    document.documentElement.lang?.toLowerCase() || "en";

  const setLang = (lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = "ltr";
    localStorage.setItem("preferredLang", lang);
    document.cookie = `preferredLang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const updateIdiomaAtivo = () => {
    const htmlLang = getLang();
    idiomaLinks.forEach(link => {
      try {
        const langAttr = (link.getAttribute("hreflang") || "").toLowerCase();
        const hrefPath = new URL(link.href, window.location.origin).pathname.toLowerCase();
        const matchLang = langAttr === htmlLang;
        const matchHref = hrefPath === currentPath || hrefPath.includes(`/${htmlLang}`);

        link.classList.toggle("ativo", matchLang || matchHref);
        link.setAttribute("aria-current", matchLang ? "true" : "false");
      } catch (err) {
        console.warn("⚠️ Erro ao validar idioma:", err);
      }
    });
  };

  updateIdiomaAtivo();

  idiomaLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const hrefLang = link.getAttribute("hreflang")?.toLowerCase();
      if (!hrefLang) return;
      const spa = link.classList.contains("spa");

      setLang(hrefLang);
      if (spa) {
        e.preventDefault();
        updateIdiomaAtivo();
      }
    });
  });

  // 🌍 Botão para alternância manual de idioma (toggle)
  const btnIdioma = document.getElementById("toggle-idioma");
  btnIdioma?.addEventListener("click", () => {
    const atual = getLang();
    const novo = atual === "en" ? "pt-BR" : "en";
    setLang(novo);
    updateIdiomaAtivo();
  });

  // ⬆️ Exibe botão "voltar ao topo" somente quando necessário
  const botaoTopo = document.querySelector(".botao-topo");
  const updateTopo = () => {
    const ativo = window.scrollY >= 300;
    if (botaoTopo) {
      botaoTopo.hidden = !ativo;
      botaoTopo.classList.toggle("visivel", ativo);
    }
  };
  window.addEventListener("scroll", updateTopo);
  updateTopo();

  botaoTopo?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 🎨 Tema com suporte a "auto"
  const applyTheme = (preferido) => {
    let final = preferido;
    if (preferido === "auto") {
      final = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.body.dataset.theme = final;
    localStorage.setItem("preferredTheme", preferido);
    document.cookie = `preferredTheme=${preferido}; path=/; max-age=31536000; SameSite=Lax`;
    return final;
  };

  let temaSalvo = localStorage.getItem("preferredTheme")
    || document.cookie.match(/preferredTheme=([^;]+)/)?.[1]
    || "auto";

  const temaFinal = applyTheme(temaSalvo);

  // Botão de alternância (dark/light/auto)
  const btnTema = document.getElementById("btn-tema");
  if (btnTema) {
    btnTema.setAttribute("aria-label", "Toggle theme");
    btnTema.setAttribute("aria-pressed", "false");

    btnTema.addEventListener("click", () => {
      const atual = localStorage.getItem("preferredTheme") || "auto";
      const novo = atual === "dark" ? "light" : atual === "light" ? "auto" : "dark";
      const aplicado = applyTheme(novo);

      btnTema.setAttribute("aria-pressed", aplicado === "dark");
      btnTema.setAttribute("aria-label", `Current theme: ${aplicado}`);
    });
  }

  // 🔁 SPA: escuta navegação e reativa idioma
  window.addEventListener("popstate", updateIdiomaAtivo);

  // 📢 Emissão do evento global
  const evento = {
    theme: temaFinal,
    lang: getLang(),
    path: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  try {
    document.dispatchEvent(new CustomEvent("footerReady", { detail: evento }));
    if (typeof window.onFooterReady === "function") {
      window.onFooterReady(evento);
    }
  } catch (err) {
    console.warn("⚠️ Erro ao emitir footerReady:", err);
  }
});

