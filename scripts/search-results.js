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
function loadSearchResults(page = 1) {
    // Número de libros por página
    const booksPerPage = 15;
    const booksContainer = document.querySelector(".books-container");
    const searchTitle = document.querySelector(".heading-2.title");
    const results = JSON.parse(localStorage.getItem("searchResults")) || [];

    // Recuperar término buscado y resultados
    const searchQuery = new URLSearchParams(window.location.search).get("query") || "";
    // Mostrar el término buscado en el título
    if (searchQuery) {
        searchTitle.textContent = `Resultados de la búsqueda para "${searchQuery}"`;
    }

    // Calcular índices para la paginación
    const startIndex = (page - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const paginatedResults = results.slice(startIndex, endIndex);

    // Limpiar el contenedor de libros
    booksContainer.replaceChildren();

    if (paginatedResults.length > 0) {
        paginatedResults.forEach(book => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("book");

            bookElement.innerHTML = `
                <h3 class="book-title" title="${book.title}">${book.title}</h3>
                <h4 class="book-author">${book.author}</h4>
                <a href="./book-details.html?id=${book.id}">
                    <img class="book-cover" src="../assets/images/${book.cover}" alt="Portada de ${book.title}" height="300px">
                </a>
                <p class="book-price">${book.price}</p>
                <a href="#" class="add-to-cart-button" title="Agregar al carrito"><i class="bx bx-cart"></i></a>
            `;

            booksContainer.appendChild(bookElement);
        });

        // Actualizar paginación
        updatePagination(page, Math.ceil(results.length / booksPerPage));
    } else {
        booksContainer.innerHTML = "<p>No se encontraron resultados para tu búsqueda.</p>";
    }
}

/**
 * Actualiza la paginación de la sección de resultados de búsqueda
 *
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Total de páginas
 *
 * @returns {undefined}
 */
function updatePagination(currentPage, totalPages) {
    const paginationContainer = document.querySelector(".pagination ul");
    paginationContainer.replaceChildren();

    // Agregar el botón "Anterior"
    const prevButton = document.createElement("li");
    prevButton.innerHTML = `<a href="#" class="prev" title="Anterior"><i class="bx bxs-chevron-left"></i></a>`;
    if (currentPage > 1) {
        prevButton.querySelector("a").addEventListener("click", () => loadSearchResults(currentPage - 1));
    } else {
        prevButton.querySelector("a").classList.add("disabled");
    }
    paginationContainer.appendChild(prevButton);

    // Agregar los números de página
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("li");
        pageButton.innerHTML = `<a href="#" class="page-numbers${currentPage === i ? " active" : ""}">${i}</a>`;
        pageButton.querySelector("a").addEventListener("click", () => loadSearchResults(i));
        paginationContainer.appendChild(pageButton);
    }

    // Agregar el botón "Siguiente"
    const nextButton = document.createElement("li");
    nextButton.innerHTML = `<a href="#" class="next" title="Siguiente"><i class="bx bxs-chevron-right"></i></a>`;
    if (currentPage < totalPages) {
        nextButton.querySelector("a").addEventListener("click", () => loadSearchResults(currentPage + 1));
    } else {
        nextButton.querySelector("a").classList.add("disabled");
    }
    paginationContainer.appendChild(nextButton);
}