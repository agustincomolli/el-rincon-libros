document.addEventListener("DOMContentLoaded", () => {
    loadSearchResults();
})

/**
 * Carga los resultados de la búsqueda en el contenedor de libros.
 *
 * Primero intenta obtener los resultados de la búsqueda desde el localStorage.
 * Si existen resultados, los itera y crea un elemento de libro para cada uno,
 * con la información correspondiente y lo agrega al contenedor de libros.
 * Si no existen resultados, muestra un mensaje de no se encontraron resultados.
 */
function loadSearchResults() {
    const booksContainer = document.querySelector(".books-container");
    const searchTitle = document.querySelector(".heading-2.title");
    const results = JSON.parse(localStorage.getItem("searchResults"));

    // Recuperar término buscado y resultados
    const searchQuery = new URLSearchParams(window.location.search).get("query") || "";
    // Mostrar el término buscado en el título
    if (searchQuery) {
        searchTitle.textContent = `Resultados de la búsqueda para “${searchQuery}”`;
    }

    if (results && results.length > 0) {
        results.forEach(book => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("book");

            bookElement.innerHTML = `
          <h3 class="book-title" title="${book.title}">${book.title}</h3>
          <h4 class="book-author">${book.author}</h4>
          <a href="./book-details.html?bookId=${book.id}">
            <img class="book-cover" src="../assets/images/${book.cover}" alt="Portada de ${book.title}" height="300px">
          </a>
          <p class="book-price">${book.price}</p>
          <a href="#" class="add-to-cart-button" title="Agregar al carrito"><i class="bx bx-cart"></i></a>
        `;

            booksContainer.appendChild(bookElement);
        });
    } else {
        booksContainer.innerHTML = "<p>No se encontraron resultados para tu búsqueda.</p>";
    }
}