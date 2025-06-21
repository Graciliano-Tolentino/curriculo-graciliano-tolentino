// ============================================================================================
// 🌐 lang-redirect.js — Redirecionamento Multilíngue Inteligente (v2.4)
// 🧭 Agora com geolocalização IP, exportação modular, callback remoto e modo teste
// ✨ Desenvolvido com sabedoria, força e beleza por Graciliano Tolentino + IA Especializada
// ============================================================================================

export function detectLanguage({ redirect = true } = {}) {
  try {
    const cookiesEnabled = navigator.cookieEnabled;
    const urlParams = new URLSearchParams(window.location.search);

    const urlLang = urlParams.get("lang");
    const previewMode = urlParams.has("previewLang");
    const debugMode = urlParams.has("debugLang");
    const testMode = urlParams.has("testLang");
    const customCallback = urlParams.get("onLang");

    const localPref = localStorage.getItem("preferredLang");
    const cookiePref = document.cookie.match(/preferredLang=([\w-]+)/)?.[1];

    // 🌐 Idiomas suportados e aliases
    const supportedLangs = new Map([
      ["pt", "pt-BR"],
      ["pt-br", "pt-BR"],
      ["en", "en"],
      ["en-us", "en"],
      ["fr", "fr-FR"],
      ["es", "es-ES"],
      // ➕ Extensível com facilidade
    ]);

    // 🔍 Detecção via navegador
    const langList = navigator.languages || [navigator.language || navigator.userLanguage];
    const browserLang = (langList[0] || "").toLowerCase();

    // 🌐 Mock de fallback por IP (em produção, substituir por chamada real a IPInfo ou Cloudflare)
    async function fetchGeoLang() {
      // Simulação: retorna "pt-BR" para IPs do Brasil
      try {
        const geo = await fetch("https://ipapi.co/json/").then(res => res.json());
        const country = geo.country_code || "";
        return country.toUpperCase() === "BR" ? "pt-BR" : "en";
      } catch {
        return "en";
      }
    }

    // 🧠 Resolve o idioma final com fallback multilayer
    function resolveLanguage(code) {
      return supportedLangs.get(code)
          || supportedLangs.get(code.split("-")[0])
          || null;
    }

    // 🔄 Função assíncrona para determinar o idioma mais confiável
    async function determineFinalLang() {
      const resolved =
        urlLang ||
        localPref ||
        cookiePref ||
        resolveLanguage(browserLang) ||
        await fetchGeoLang() || // fallback por IP
        "en"; // fallback universal

      return resolved;
    }

    determineFinalLang().then((lang) => {
      // 🏷️ Atualiza atributos do HTML
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", "ltr");

      // 💾 Persistência local
      if (!localPref && !urlLang) {
        localStorage.setItem("preferredLang", lang);
      }

      // 🍪 Persistência via cookie
      if (cookiesEnabled && !cookiePref && !urlLang) {
        document.cookie = `preferredLang=${lang}; path=/; max-age=31536000; SameSite=Lax; Secure`;
      }

      // 🪪 Logging inteligente
      console.info(`🌐 Idioma preferido detectado: ${lang}`);
      if (debugMode || testMode) {
        console.debug({
          browserLang,
          urlLang,
          localPref,
          cookiePref,
          resolvedLang: lang,
          previewMode,
          debugMode,
          testMode
        });
      }

      // 🧩 Callback via função global (ex: window.onLanguageDetected)
      if (typeof window.onLanguageDetected === "function") {
        window.onLanguageDetected(lang);
      }

      // 🧩 Callback via parâmetro de URL (?onLang=minhaFuncao)
      if (customCallback && typeof window[customCallback] === "function") {
        window[customCallback](lang);
      }

      // 🧪 Modo de teste unitário: não redireciona, apenas loga
      if (testMode) return;

      // 🔎 Caminho base da URL atual
      const currentPath = window.location.pathname;
      const base = currentPath.substring(0, currentPath.lastIndexOf("/") + 1);

      // 🔁 Página padrão se idioma não tiver correspondente explícito
      const fallbackPage = "index.html";

      // 📂 Define página de destino
      const targetPage =
        lang === "en"      ? "index-en.html" :
        lang === "pt-BR"   ? "index.html"    :
        supportedLangs.has(lang) ? `index-${lang}.html` :
        fallbackPage;

      const targetUrl = `${base}${targetPage}`;

      // 🔁 Previne redirecionamento em loop
      const currentFile = currentPath.split("/").pop();
      const alreadyRedirected = currentFile === targetPage;

      // 🚀 Redireciona se ainda não estiver na página correta
      if (!alreadyRedirected && redirect && !previewMode) {
        window.location.href = targetUrl;
      }
    }).catch((error) => {
      console.error("❌ Erro durante a determinação do idioma:", error);
    });

  } catch (error) {
    // 🧯 Captura de erro global
    console.error("❌ Erro inesperado no redirecionador multilíngue.");
    console.error("🧾 Diagnóstico técnico:", error);
    console.warn("ℹ️ Verifique suporte do navegador a cookies, localStorage e URLSearchParams.");
  }
}
