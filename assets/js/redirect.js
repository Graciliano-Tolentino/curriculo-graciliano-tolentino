// 🌐 redirect.js v3 — Graciliano Tolentino
// 🎯 Redirecionamento multilíngue inteligente, resiliente e expansível (Padrão Internacional 12/10)

(function () {
  // 🧱 Configurações base (fallback e rotas multilíngue)
  const fallbackLang = "pt-br";

  const routes = {
    "pt": "/index.html",
    "pt-br": "/index.html",
    "en": "/index-en.html",
    "es": "/index-es.html",
    "fr": "/index-fr.html"
  };

  const basePath = window.__redirectBasePath || "/"; // permite uso em subdiretórios

  // 🔐 Verifica se localStorage pode ser usado
  function canUseLocalStorage() {
    try {
      const key = "__test__";
      localStorage.setItem(key, "ok");
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
  }

  // 🧠 Normaliza qualquer idioma recebido
  function normalizeLang(raw) {
    return (raw || "").toLowerCase().trim();
  }

  // 🌍 Detecta lista de idiomas preferidos
  const userLangs = navigator.languages || [navigator.language || navigator.userLanguage || fallbackLang];

  // 🔎 Encontra o primeiro idioma reconhecido nas rotas
  const preferredLang = userLangs
    .map(normalizeLang)
    .find(l => routes[l] || routes[l.split("-")[0]]) || fallbackLang;

  const targetRoute =
    basePath + (routes[preferredLang] || routes[preferredLang.split("-")[0]] || routes[fallbackLang]).replace(/^\//, "");

  // 💾 Armazena o idioma, se aplicável
  if (canUseLocalStorage()) {
    const existing = localStorage.getItem("preferredLanguage");
    if (!existing || existing !== preferredLang) {
      localStorage.setItem("preferredLanguage", preferredLang);
    }
  }

  // 🔌 Não redirecionar se offline (modo PWA ou queda de conexão)
  if (!navigator.onLine) {
    console.warn("📡 Dispositivo offline — redirecionamento desativado.");
    return;
  }

  // 🚫 Previne loops e redirecionamentos redundantes
  const currentPath = window.location.pathname;
  if (!currentPath.includes(targetRoute)) {
    if (window.__redirectLogLevel === "debug") {
      console.info("🌐 Redirecionando para:", targetRoute, "| Idioma detectado:", preferredLang);
    }
    try {
      window.location.href = targetRoute;
    } catch (err) {
      console.error("❌ Falha no redirecionamento:", err);
      document.body.innerHTML = `
        <h1>Redirecionamento não realizado</h1>
        <p>Selecione manualmente:</p>
        <a href="/index.html">🌎 Português</a> | <a href="/index-en.html">🌍 English</a>
      `;
    }
  } else {
    if (window.__redirectLogLevel === "debug") {
      console.info("✅ Já na rota correta:", currentPath);
    }
  }
})();

