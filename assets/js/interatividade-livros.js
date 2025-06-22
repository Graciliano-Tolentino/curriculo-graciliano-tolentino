/**
 * 📌 Interatividade Avançada da Galeria de Livros (High Tech v4.1)
 * 
 * Recursos Implementados:
 * - Efeitos visuais e interação elegante
 * - Acessibilidade aprimorada (teclado e leitores de tela)
 * - Performance otimizada
 *
 * @author Graciliano Tolentino
 * @version 4.1
 */

document.addEventListener('DOMContentLoaded', () => {

  const livros = document.querySelectorAll('.livro');

  /**
   * ✅ Aplica efeito de hover/focus visual e acessível
   */
  livros.forEach(livro => {
    livro.setAttribute('tabindex', '0');

    livro.addEventListener('mouseenter', () => destacarLivro(livro));
    livro.addEventListener('mouseleave', () => resetarLivro(livro));
    livro.addEventListener('focus', () => destacarLivro(livro));
    livro.addEventListener('blur', () => resetarLivro(livro));
  });

  function destacarLivro(livro) {
    livro.classList.add('livro-destaque');
  }

  function resetarLivro(livro) {
    livro.classList.remove('livro-destaque');
  }

  /**
   * ✅ Navegação acessível com teclado
   */
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter' && document.activeElement.classList.contains('livro')) {
      const linkCompra = document.activeElement.querySelector('.botao-destaque');
      if (linkCompra) linkCompra.click();
    }
  });

});
