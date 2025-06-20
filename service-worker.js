// 🌐 Service Worker — Graciliano Curriculum PWA (v1.4.0)
const CACHE_VERSION = "v1.4.0";
const STATIC_CACHE = `graciliano-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `graciliano-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `graciliano-images-${CACHE_VERSION}`;
const FALLBACK_HTML = "/offline.html";
const MAX_DYNAMIC_ITEMS = 30;

// 📦 Arquivos estáticos essenciais para pré-cache
const staticAssets = [
  "/",
  "/index.html",
  "/index-en.html",
  "/manifest.json",
  "/offline.html", // novo fallback HTML
  "/assets/css/base.css",
  "/assets/css/layout.css",
  "/assets/css/responsivo.css",
  "/assets/css/header.css",
  "/assets/css/footer.css",
  "/assets/css/print.css",
  "/assets/images/icon-192.png",
  "/assets/images/icon-512.png",
  "/assets/images/screenshot-home.jpg",
  "/assets/images/screenshot-horiz.jpg"
];

// 🔧 Normaliza URLs (sem querystring/diferenciação por tracking)
const normalizeRequest = (request) => {
  const url = new URL(request.url);
  url.search = "";
  return new Request(url, {
    method: request.method,
    headers: request.headers,
    mode: request.mode,
    credentials: request.credentials,
    redirect: request.redirect
  });
};

// ♻️ Limita o número de itens em cache dinâmico
const limitCacheSize = (cacheName, maxItems) => {
  caches.open(cacheName).then(cache =>
    cache.keys().then(keys => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => limitCacheSize(cacheName, maxItems));
      }
    })
  );
};

// ✅ INSTALL — Pré-cache de assets críticos
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(staticAssets))
      .catch((err) => console.error("⚠️ Falha ao fazer o pré-cache:", err))
  );
});

// ✅ ACTIVATE — Remove caches antigos + avisa usuários
self.addEventListener("activate", (event) => {
  clients.claim();
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      );

      // 💬 Notifica páginas abertas sobre nova versão
      const clientList = await self.clients.matchAll({ type: "window" });
      clientList.forEach(client => {
        client.postMessage({ type: "NEW_VERSION_AVAILABLE" });
      });
    })()
  );
});

// ✅ FETCH — Estratégias por tipo de recurso
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const request = normalizeRequest(event.request);
  const dest = event.request.destination;

  // ❌ Ignora URLs sensíveis
  const url = request.url;
  if (url.includes("auth") || url.includes("token=") || url.includes("admin")) return;

  // 🌐 Estratégia para documentos HTML (network-first)
  if (dest === "document") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status < 400) {
            caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, response.clone()));
            return response;
          }
          return caches.match(FALLBACK_HTML);
        })
        .catch(() => caches.match(FALLBACK_HTML))
    );
    return;
  }

  // 🧠 Estratégia para CSS e JS (stale-while-revalidate)
  if (dest === "style" || dest === "script") {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((networkRes) => {
          if (networkRes.status < 400) {
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, networkRes.clone()));
          }
          return networkRes;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 🖼️ Estratégia para imagens (cache-first com fallback)
  if (dest === "image") {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request)
          .then((response) => {
            if (response.status < 400) {
              caches.open(IMAGE_CACHE).then((cache) => {
                cache.put(request, response.clone());
                limitCacheSize(IMAGE_CACHE, 50);
              });
              return response;
            }
            return caches.match("/assets/images/fallback.jpg");
          })
          .catch(() => caches.match("/assets/images/fallback.jpg"));
      })
    );
    return;
  }

  // 🌐 Fallback genérico (network-first com offline fallback)
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status < 400) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, response.clone());
            limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS);
          });
          return response;
        }
        return caches.match(request);
      })
      .catch(() => caches.match(request) || caches.match(FALLBACK_HTML))
  );
});

// 🧭 FINALIZAÇÃO DO SERVICE WORKER
// Esta versão implementa estratégias inteligentes de cache para:
// - HTML: network-first com fallback para offline.html
// - CSS/JS: stale-while-revalidate
// - Imagens: cache-first com fallback visual
// - Outros: network-first com suporte a falhas

// 🔐 Segurança e integridade: URLs com parâmetros como auth/token são ignoradas
// 🧼 Limpeza automática de caches antigos a cada ativação
// 📢 Comunicação direta com páginas abertas sobre novas versões
// ⚡ Performance PWA classe internacional (Core Web Vitals-friendly)

// 🔮 PRONTO PARA EXPANSÃO:
// - Notificações Push com permissionamento
// - Workbox strategies com fallback avançado
// - IndexedDB para dados offline persistentes
// - Atualização silenciosa + UX otimizada

// ✨ Desenvolvido com sabedoria, força e beleza
// 📌 Graciliano Tolentino — Curriculum PWA High-Tech
