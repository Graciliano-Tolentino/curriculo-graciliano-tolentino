<!-- Exemplo para inserir no topo de páginas como livros.html ou certificados.html -->
<input type="search" id="busca" placeholder="🔍 Buscar..." aria-label="Buscar itens" />

<ul id="lista-filtrada">
  <li data-item="Método Caracol">Método Caracol</li>
  <li data-item="Mini Manual do Guerrilheiro Digital">Mini Manual do Guerrilheiro Digital</li>
</ul>

document.addEventListener("DOMContentLoaded", () => {
  const busca = document.getElementById("busca");
  const itens = document.querySelectorAll("#lista-filtrada [data-item]");

  busca.addEventListener("input", (e) => {
    const filtro = e.target.value.toLowerCase();
    itens.forEach(item => {
      const texto = item.dataset.item.toLowerCase();
      item.style.display = texto.includes(filtro) ? "list-item" : "none";
    });
  });
});
