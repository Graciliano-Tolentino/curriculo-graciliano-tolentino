/**
 * 📌 Menu Esquerdo — Carregamento Dinâmico e Modular
 *
 * ✅ Melhorias aplicadas nesta versão:
 * - Tratamento de erros amigável e fallback visual
 * - Compatibilidade ampliada com navegadores antigos
 * - Código organizado, escalável e bem comentado
 *
 * @version 3.1 (High Tech)
 */

document.addEventListener('DOMContentLoaded', () => {

  /**
   * ✅ Verifica suporte básico do navegador (Graceful Degradation)
   */
  if (!window.fetch) {
    console.warn('Fetch não suportado pelo navegador. Carregamento estático necessário.');
    const aviso = document.createElement('div');
    aviso.textContent = '⚠️ Este navegador não suporta funcionalidades essenciais.';
    aviso.style.cssText = `
      position: fixed; top: 0; left: 0;
      padding: 10px; background: #ffdddd; color: #a00;
      width: 100%; text-align: center; z-index: 10000;
    `;
    document.body.prepend(aviso);
    return;
  }

  /**
   * ✅ Função de carregamento modular e dinâmico
   */
  async function carregarMenuEsquerdo() {
    try {
      const resposta = await fetch('/partials/menu-esquerdo.html');
      if (!resposta.ok) throw new Error('Falha ao carregar o menu esquerdo.');

      const html = await resposta.text();
      const containerMenu = document.createElement('div');
      containerMenu.innerHTML = html;

      document.body.prepend(containerMenu.firstElementChild);

      inicializarInteratividadeMenu();
      inicializarScrollAtivo();
      
    } catch (erro) {
      console.error('Erro ao carregar menu:', erro);
      const avisoErro = document.createElement('div');
      avisoErro.textContent = '⚠️ Menu indisponível no momento. Por favor, recarregue a página.';
      avisoErro.style.cssText = `
        position: fixed; top: 0; left: 0;
        padding: 10px; background: #ffdddd; color: #a00;
        width: 100%; text-align: center; z-index: 9999;
      `;
      document.body.prepend(avisoErro);
    }
  }

  // Executa o carregamento modular inicial
  carregarMenuEsquerdo();

});

/**
 * 📌 Inicializa Interatividade e Navegação Suave (High Tech v3.1)
 * 
 * ✅ Melhorias desta versão:
 * - Navegação fluida com scroll suave
 * - Atributos ARIA para acessibilidade completa
 * - Event Throttle para performance otimizada
 */

// Inicializa a interatividade principal do menu lateral
function inicializarInteratividadeMenu() {
  const linksMenu = document.querySelectorAll('.menu-links a');

  linksMenu.forEach(link => {
    // Define atributo ARIA inicialmente
    link.setAttribute('aria-current', 'false');

    // Scroll suave e destaque ao clicar
    link.addEventListener('click', (evento) => {
      evento.preventDefault();
      const destino = document.querySelector(link.getAttribute('href'));
      
      if (destino) {
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      linksMenu.forEach(lnk => {
        lnk.classList.remove('ativo');
        lnk.setAttribute('aria-current', 'false');
      });

      link.classList.add('ativo');
      link.setAttribute('aria-current', 'page');
    });

    // Navegação acessível por teclado com atributos ARIA
    link.addEventListener('focus', () => {
      link.classList.add('ativo');
      link.setAttribute('aria-current', 'page');
    });

    link.addEventListener('blur', () => {
      link.classList.remove('ativo');
      link.setAttribute('aria-current', 'false');
    });
  });
}

/**
 * ✅ Verifica e destaca automaticamente a seção ativa com Event Throttle
 */
function inicializarScrollAtivo() {
  const secoes = document.querySelectorAll('section[id]');
  const linksMenu = document.querySelectorAll('.menu-links a');

  // Throttle otimizado para eventos de scroll
  window.addEventListener('scroll', throttle(() => {
    let secaoAtual = '';

    secoes.forEach(secao => {
      const topo = secao.offsetTop - 70;
      const altura = secao.offsetHeight;

      if (window.scrollY >= topo && window.scrollY < topo + altura) {
        secaoAtual = secao.getAttribute('id');
      }
    });

    linksMenu.forEach(link => {
      link.classList.remove('ativo');
      link.setAttribute('aria-current', 'false');

      if (link.getAttribute('href') === `#${secaoAtual}`) {
        link.classList.add('ativo');
        link.setAttribute('aria-current', 'page');
      }
    });

  }, 100)); // executa a cada 100ms
}

/**
 * ⚙️ Throttle: Função de otimização de eventos
 * - Limita a frequência de execução da função ao intervalo especificado
 */
function throttle(callback, delay) {
  let ultimoEvento;
  let timer;

  return function () {
    const contexto = this;
    const agora = Date.now();
    const argumentos = arguments;

    if (ultimoEvento && agora < ultimoEvento + delay) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ultimoEvento = agora;
        callback.apply(contexto, argumentos);
      }, delay);
    } else {
      ultimoEvento = agora;
      callback.apply(contexto, argumentos);
    }
  };
}

