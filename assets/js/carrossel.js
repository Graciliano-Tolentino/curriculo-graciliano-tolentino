// ===========================================================================================
// 📜 scripts/carrossel-curriculo.js — Carrossel Interativo Currículo Graciliano Tolentino
// 🧠 Swipe, acessibilidade, fullscreen e API de controle externo
// ===========================================================================================

(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const carrosseis = document.querySelectorAll('.carrossel-curriculo');
    if (!carrosseis.length) return;

    carrosseis.forEach((carrossel, indice) => {
      const slides = carrossel.querySelectorAll('img');
      if (slides.length <= 1) return;

      let indiceAtual = 0;
      const idCarrossel = carrossel.id || `carrossel-cv-${indice}`;
      carrossel.id = idCarrossel;

      // 🔘 Botões de navegação
      const btnAnterior = document.createElement('button');
      btnAnterior.className = 'carrossel-controle carrossel-prev';
      btnAnterior.setAttribute('aria-label', 'Imagem anterior');
      btnAnterior.setAttribute('aria-controls', idCarrossel);
      btnAnterior.textContent = '‹';

      const btnProximo = document.createElement('button');
      btnProximo.className = 'carrossel-controle carrossel-next';
      btnProximo.setAttribute('aria-label', 'Próxima imagem');
      btnProximo.setAttribute('aria-controls', idCarrossel);
      btnProximo.textContent = '›';

      carrossel.append(btnAnterior, btnProximo);

      // 🎙️ Acessibilidade para leitores de tela
      const announcer = document.createElement('div');
      announcer.id = `announce-${idCarrossel}`;
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'polite');
      carrossel.appendChild(announcer);

      slides.forEach((slide) => {
        slide.classList.add('transicao');
        slide.setAttribute('loading', 'lazy');
      });

      const mostrarSlide = (indice) => {
        slides.forEach((slide, i) => {
          const ativo = i === indice;
          slide.classList.toggle('ativo', ativo);
          slide.classList.toggle('inativo', !ativo);
          slide.setAttribute('aria-hidden', !ativo);
          slide.setAttribute('tabindex', ativo ? '0' : '-1');
          slide.setAttribute('role', 'tabpanel');
          slide.setAttribute('aria-label', `Slide ${i + 1} de ${slides.length}`);
        });

        const announcerEl = document.getElementById(`announce-${idCarrossel}`);
        if (announcerEl) announcerEl.textContent = `Slide ${indice + 1} de ${slides.length}`;
        slides[indice]?.focus?.();
      };

      btnAnterior.addEventListener('click', () => {
        indiceAtual = (indiceAtual - 1 + slides.length) % slides.length;
        mostrarSlide(indiceAtual);
      });

      btnProximo.addEventListener('click', () => {
        indiceAtual = (indiceAtual + 1) % slides.length;
        mostrarSlide(indiceAtual);
      });

      mostrarSlide(indiceAtual);

      let touchStartX = 0;
      let touchEndX = 0;

      carrossel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      carrossel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 30) btnProximo.click();
        if (touchEndX > touchStartX + 30) btnAnterior.click();
      });
    });
  });
})();

// ===========================================================================================
// 🖥️ Modo fullscreen — Visualização de certificados, diplomas e projetos
// ===========================================================================================

(() => {
  let carrosselAtivo = null;
  let focoAnterior = null;

  window.abrirFullscreenCV = function (container) {
    const carrossel = container.querySelector('.carrossel-curriculo');
    if (!carrossel || carrossel.classList.contains('fullscreen')) return;

    focoAnterior = document.activeElement;
    carrossel.classList.add('fullscreen', 'transicao');
    void carrossel.offsetWidth;
    requestAnimationFrame(() => {
      carrossel.classList.add('ativo');
    });

    carrosselAtivo = carrossel;

    const botaoFechar = document.getElementById('fecharFullscreen');
    if (botaoFechar) {
      botaoFechar.hidden = false;
      botaoFechar.setAttribute('aria-hidden', 'false');
      setTimeout(() => botaoFechar.focus(), 150);
    }

    document.body.style.overflow = 'hidden';
  };

  window.fecharFullscreenCV = function () {
    if (!carrosselAtivo) return;

    const carrossel = carrosselAtivo;
    carrossel.classList.remove('ativo');

    setTimeout(() => {
      carrossel.classList.remove('fullscreen');
      carrosselAtivo = null;

      const botaoFechar = document.getElementById('fecharFullscreen');
      if (botaoFechar) {
        botaoFechar.hidden = true;
        botaoFechar.setAttribute('aria-hidden', 'true');
      }

      document.body.style.overflow = '';
      focoAnterior?.focus?.();
    }, 250);
  };

  document.addEventListener('keydown', (event) => {
    if (!carrosselAtivo) return;

    switch (event.key) {
      case 'Escape':
        fecharFullscreenCV();
        break;
      case 'ArrowRight':
        carrosselAtivo.querySelector('.carrossel-next')?.click();
        break;
      case 'ArrowLeft':
        carrosselAtivo.querySelector('.carrossel-prev')?.click();
        break;
    }
  });
})();

// ===========================================================================================
// 🔁 API Pública — Controle externo do carrossel interativo do currículo
// ===========================================================================================

window.CurriculoCarrossel = {
  next(id) {
    document.querySelector(`#${id} .carrossel-next`)?.click();
  },
  prev(id) {
    document.querySelector(`#${id} .carrossel-prev`)?.click();
  },
  goTo(id, index) {
    const carrossel = document.getElementById(id);
    if (!carrossel) return;

    const slides = carrossel.querySelectorAll('img');
    if (!slides.length || index < 0 || index >= slides.length) return;

    const btnAnterior = carrossel.querySelector('.carrossel-prev');
    const btnProximo = carrossel.querySelector('.carrossel-next');

    let contador = 0;
    const intervalo = setInterval(() => {
      const atual = Array.from(slides).findIndex((el) => el.classList.contains('ativo'));
      if (atual === index) return clearInterval(intervalo);

      if (index > atual) btnProximo?.click();
      else btnAnterior?.click();

      if (++contador > slides.length * 2) clearInterval(intervalo);
    }, 100);
  },
  openFullscreen(id) {
    const container = document.querySelector(`#${id}`)?.closest('.carrossel-container');
    if (container) abrirFullscreenCV(container);
  },
  closeFullscreen() {
    fecharFullscreenCV();
  }
};
