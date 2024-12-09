const searchInput = document.querySelector("#search");
const searchButton = document.querySelector("#search-button");

document.addEventListener("DOMContentLoaded", () => {
    loadData();

    searchButton.addEventListener("click", search);
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            search();
        }
    });
});

/**
 * Carga los libros en la página
 *
 * @param {number} page - Página que se quiere cargar (opcional, por defecto 1)
 *
 * @returns {undefined}
 */
function loadData(page = 1) {
    const booksPerPage = 15;
    const startIndex = (page - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;

    fetch("/data/books.json")
        .then(response => response.json())
        .then(data => {
            const booksContainer = document.querySelector(".books-container");
            booksContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar los nuevos libros

            for (let i = startIndex; i < endIndex && i < data.length; i++) {
                const book = data[i];
                const bookElement = createBookElement(book);
                booksContainer.appendChild(bookElement);

                const addToCartButton = bookElement.querySelector(".add-to-cart-button");
                addToCartButton.addEventListener("click", addToCart(book.id));
            }

            updatePagination(page, Math.ceil(data.length / booksPerPage));
        })
        .catch(error => console.error("Error:", error));
}

/**
 * Crea un elemento HTML que representa un libro
 * 
 * @param {object} book - Objeto con la informaci n del libro
 * @returns {HTMLElement} - Elemento HTML que representa el libro
 */
function createBookElement(book) {
    const bookElement = document.createElement("div");
    bookElement.className = "book";

    const titleElement = document.createElement("h3");
    titleElement.className = "book-title";
    titleElement.textContent = book.title;
    bookElement.appendChild(titleElement);

    const authorElement = document.createElement("h4");
    authorElement.className = "book-author";
    authorElement.textContent = book.author;
    bookElement.appendChild(authorElement);

    const coverElement = document.createElement("a");
    coverElement.href = `./book-details.html?id=${book.id}`;
    coverElement.dataset.bookId = book.id;
    coverElement.innerHTML = `<img class="book-cover" src="../assets/images/${book.cover}" alt="Portada de ${book.title}" height="300px" title="${book.title}">`;
    bookElement.appendChild(coverElement);

    // Formateador de precios para Argentina
    const priceFormatter = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
    });

    const priceElement = document.createElement("p");
    priceElement.className = "book-price";
    priceElement.textContent = priceFormatter.format(book.price);
    bookElement.appendChild(priceElement);

    const addToCartElement = document.createElement("a");
    addToCartElement.className = "add-to-cart-button";
    addToCartElement.href = "#";
    addToCartElement.title = "Agregar al carrito";
    addToCartElement.innerHTML = "<i class='bx bx-cart-add'></i>";
    addToCartElement.dataset.bookId = book.id;
    bookElement.appendChild(addToCartElement);

    return bookElement;
}

/**
 * Actualiza la paginación de la sección de libros
 *
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Total de páginas
 *
 * @returns {undefined}
 */
function updatePagination(currentPage, totalPages) {
    const paginationContainer = document.querySelector(".pagination ul");
    paginationContainer.innerHTML = "";

    // Agregar el botón "Anterior"
    const prevButton = document.createElement("li");
    prevButton.innerHTML = `<a href="#" class="prev" title="Anterior"><i class="bx bxs-chevron-left"></i></a>`;
    prevButton.querySelector("a").addEventListener("click", () => loadData(currentPage - 1));
    paginationContainer.appendChild(prevButton);

    // Agregar los números de página
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("li");
        pageButton.innerHTML = `<a href="#" class="page-numbers${currentPage === i ? " active" : ""}">${i}</a>`;
        pageButton.querySelector("a").addEventListener("click", () => loadData(i));
        paginationContainer.appendChild(pageButton);
    }

    // Agregar el botón "Siguiente"
    const nextButton = document.createElement("li");
    nextButton.innerHTML = `<a href="#" class="next" title="Siguiente"><i class="bx bxs-chevron-right"></i></a>`;
    nextButton.querySelector("a").addEventListener("click", () => loadData(currentPage + 1));
    paginationContainer.appendChild(nextButton);
}

/**
 * Busca los libros que coincidan con el título, autor o género que se
 * introdujo en el campo de búsqueda.
 *
 * @returns {undefined}
 */
function search() {
    const searchQuery = document.querySelector("#search").value.toLowerCase();

    fetch("../data/books.json")
        .then(response => response.json())
        .then(books => {
            // Filtrar los libros que coincidan con el título, autor o género.
            const results = books.filter(book =>
                book.title.toLowerCase().includes(searchQuery) ||
                book.author.toLowerCase().includes(searchQuery) ||
                book.genre.toLowerCase().includes(searchQuery)
            );

            // Guardar los resultados en localStorage para pasarlos entre páginas.
            localStorage.setItem("searchResults", JSON.stringify(results));

            // Redirigir con el término buscado en la URL
            window.location.href = `./search-results.html?query=${encodeURIComponent(searchQuery)}`;
        })
        .catch(error => console.error("Error cargando los libros:", error));
}

/**
 * Agrega un libro al carrito de compras.
 *
 * @param {number} bookId - Identificador del libro
 * @returns {function} - Función que se encarga de agregar el libro al carrito
 *
 * La función devuelta guarda el libro en el carrito en localStorage.
 */
function addToCart(bookId) {
    if (!bookId) return null;

    return () => {
        const cart = new Map(JSON.parse(localStorage.getItem("cart") || "[]"));
        const currentQuantity = cart.get(bookId) || 0;

        if (currentQuantity < 10) {  // Límite de cantidad
            cart.set(bookId, currentQuantity + 1);
            // Convertir el Map a un array para poder guardarlo en localStorage
            // y convertirlo a JSON
            localStorage.setItem("cart", JSON.stringify([...cart]));
            showNotification("Libro agregado al carrito");
        }
    };
}

/**
 * Muestra un mensaje emergente para informar al usuario
 * que el libro ha sido agregado al carrito.
 *
 * @param {string} message - Mensaje a mostrar
 *
 * La función crea un elemento <div> y lo agrega al body
 * con el mensaje pasado como parámetro. Luego,
 * aplica una animación de aparición y desaparición
 * para mostrar y ocultar el mensaje.
 */
function showNotification(message) {
    // Crear el contenedor del modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
    `;

    // Agregar el mensaje al modal
    modal.textContent = message;

    // Agregar el modal al body
    document.body.appendChild(modal);

    // Animación de aparición
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    // Desaparecer después de 3 segundos
    setTimeout(() => {
        modal.style.opacity = '0';
        // Eliminar de DOM después de la animación
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }, 3000);
}