import { formatCurrency } from "./general.js";
const priceFormatter = formatCurrency();

document.addEventListener("DOMContentLoaded", function () {
    loadData();
});

/**
 * Carga los datos del libro en la página
 *
 * Obtiene el ID del libro de la URL, busca el libro en el archivo books.json
 * y, si lo encuentra, carga sus datos en la página
 *
 * @returns {undefined}
 */
async function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");
    const bookDetails = document.querySelector(".book-details");

    // Mostrar el detalle del libro.
    bookDetails.style.display = "flex";

    try {
        const response = await fetch("/data/books.json");
        const data = await response.json();
        const book = data.find(book => book.id === bookId);
        if (book) {
            // Carga los datos del libro en la página
            document.querySelector("#book-title").textContent = book.title;
            document.querySelector(".book-author").textContent = book.author;
            document.querySelector(".book-description").textContent = book.description;
            document.querySelector(".book-price").textContent = priceFormatter.format(book.price);
            document.querySelector(".book-image").setAttribute("src", `../assets/images/${book.cover}`);
            document.querySelector(".book-image").setAttribute("alt", `Portada de ${book.title}`);
            document.querySelector(".book-image").setAttribute("title", `Portada de ${book.title}`);
            document.querySelector("#book-genre").textContent = `Género:  ${book.genre}`;
            document.querySelector("#book-year").textContent = `Publicado en: ${book.publicationDate}`;
            document.querySelector("#book-pages").textContent = `Páginas: ${book.pages}`;
            document.querySelector("#book-publisher").textContent = `Editorial: ${book.publisher}`;
            document.querySelector("#book-isbn").textContent = `ISBN: ${book.isbn}`;
            document.querySelector(".add-to-cart-button").addEventListener("click", addToCart(book.id));
        } else {
            console.error("Libro no encontrado");
            window.location.href = "../pages/error-404.html";
        }
    } catch (error) {
        console.error("Error:", error);
    }
};


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
