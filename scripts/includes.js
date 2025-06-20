// ============================================================================================
// 🧩 includes.js v3.0 — Carregador Avançado de Partials HTML
// 🔁 Retry | 🧠 Deep Includes Ready | 🌐 Skeleton UX | 🔒 Verificação | 🔧 SPA-aware
// ============================================================================================

/**
 * Tenta buscar o recurso até N vezes com delay
 */
async function tryFetch(url, tentativas = 2, delay = 250) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error(`❌ Falha ao carregar ${url} após ${tentativas} tentativas.`);
}

/**
 * Verifica se o conteúdo retornado é HTML válido
 */
function isValidHTML(content) {
  const template = document.createElement("template");
  template.innerHTML = content.trim();
  return template.content.childElementCount > 0;
}

/**
 * Carrega todos os [data-include] que ainda não foram processados
 */
export async function loadPartials(root = document) {
  const partials = root.querySelectorAll("[data-include]:not([data-included])");

  for (const el of partials) {
    const url = el.getAttribute("data-include");
    if (!url) continue;

    // Insere skeleton loader temporário
    el.innerHTML = `<div class="skeleton-loader" aria-hidden="true"></div>`;

    try {
      const response = await tryFetch(url);
      const html = await response.text();

      if (!isValidHTML(html)) throw new Error("🧯 Conteúdo inválido (não é HTML estruturado)");

      el.innerHTML = html;
      el.setAttribute("data-included", "true");

      document.dispatchEvent(new CustomEvent("includeLoaded", {
        detail: { url, element: el }
      }));

      // (Opcional) suporte a includes aninhados:
      await loadPartials(el); // chamada recursiva ⚙️

    } catch (err) {
      console.warn(`❌ Erro ao incluir ${url}:`, err);
      el.innerHTML = `<div class="text-muted">[Erro ao carregar ${url}]</div>`;
    }
  }
}

// ============================================================================================
// 🚀 Inicialização automática + suporte a SPA + extensibilidade global
// ============================================================================================

async function initIncludes(trigger = "manual") {
  try {
    await loadPartials();
    console.info(`✅ Partials carregados (${trigger})`);

    // Callback externo (caso framework ou CMS precise escutar)
    if (typeof window.onPartialsLoaded === "function") {
      window.onPartialsLoaded({ trigger, timestamp: Date.now() });
    }

  } catch (err) {
    console.warn(`❌ Erro durante o carregamento de includes (${trigger}):`, err);
  }
}

// ✅ Executa ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  initIncludes("DOMContentLoaded");
});

// ♻️ Reexecuta ao mudar de rota em SPA
window.addEventListener("popstate", () => {
  initIncludes("popstate");
});

// 💡 Reutilização manual possível:
//   window.onPartialsLoaded = (e) => { ... };
//   initIncludes("custom-trigger");
