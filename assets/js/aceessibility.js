document.addEventListener("DOMContentLoaded", () => {
  // 🔑 Atalhos de teclado
  const shortcuts = {
    "1": "#titulo-perfil",
    "2": "#formacao",
    "3": "#experiencia",
    "4": "#contato-rapido",
    "5": "#contato"
  };

  document.addEventListener("keydown", (e) => {
    if (e.altKey && shortcuts[e.key]) {
      e.preventDefault();
      document.querySelector(shortcuts[e.key]).focus({behavior: 'smooth'});
    }
  });

  // 🎯 Foco visível (para elementos com tabindex)
  const tabbableSections = document.querySelectorAll("[tabindex='0']");
  tabbableSections.forEach(section => {
    section.addEventListener("focus", () => {
      section.style.outline = "3px solid #00b4d8";
      section.style.outlineOffset = "0.2rem";
    });
    section.addEventListener("blur", () => {
      section.style.outline = "none";
    });
  });
});
