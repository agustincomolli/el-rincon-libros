const priceFormatter = formatCurrency();

document.addEventListener("DOMContentLoaded", () => {
    const promotionalCodeButton = document.querySelector("#promotional-code-button");
    const addNodeButton = document.querySelector("#add-note-button");

    // Mostrar u ocultar el cuadro de ingreso de códigos promocionales
    promotionalCodeButton.addEventListener("click", () => {
        const promotionalCode = document.querySelector(".promotional-code");
        promotionalCode.classList.toggle("hidden");
    });

    // Mostrar u ocultar el cuadro de ingreso de notas
    addNodeButton.addEventListener("click", () => {
        const cartNote = document.querySelector(".cart-note");
        cartNote.classList.toggle("hidden");
    });

    loadCart();
});

/**
 * Carga el carrito de compras desde el localStorage y
 * muestra los libros en la página.
 *
 * @return {void}
 */
async function loadCart() {
    const booksContainer = document.querySelector(".books");
    const cartSection = document.querySelector(".cart");
    const emptyCartMessage = document.querySelector(".empty-cart-message");
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");

    // Si no hay items en el carrito informar al usuario.
    if (cartData.length === 0) {
        cartSection.style.display = "none";
        emptyCartMessage.style.display = "block";
        return;
    }

    try {
        const response = await fetch("../data/books.json");
        const books = await response.json();
        
        booksContainer.innerHTML = "";
        let totalCart = 0;

        cartData.forEach(([bookId, quantity]) => {
            const book = books.find(b => b.id.toString() === bookId.toString());
            if (book) {
                const bookPrice = book.price;
                const totalPrice = bookPrice * quantity;
                totalCart += totalPrice;

                const cartItem = document.createElement("li");
                cartItem.classList.add("book");
                cartItem.innerHTML = `
                    <div class="book-image">
                        <img src="../assets/images/${book.cover}" height="100px" alt="${book.title}">
                    </div>
                    <div class="book-details">
                        <div class="book-info">
                            <span class="book-title">${book.title}</span>
                            <span class="book-price">${priceFormatter.format(bookPrice)}</span>
                        </div>
                        <div class="book-quantity">
                            <button class="book-quantity-button" id="decrease" title="Disminuir"><i class='bx bx-minus'></i></button>
                            <span class="book-quantity-value">${quantity}</span>
                            <button class="book-quantity-button" id="increase" title="Aumentar"><i class='bx bx-plus'></i></button>
                        </div>
                        <div class="book-total">
                            <span class="book-total-price">${priceFormatter.format(totalPrice)}</span>
                        </div>
                        <button class="book-remove-button" data-book-id="${bookId}" title="Eliminar"><i class='bx bx-trash'></i></button>
                    </div>
                `;
                booksContainer.appendChild(cartItem);
            }
        })

        // Recorrer los botones de eliminación y asignarles el evento.
        document.querySelectorAll(".book-remove-button").forEach(button => {
            button.addEventListener("click", () => {
                removeFromCart(button.dataset.bookId);
            });
        });

        addQuantityButtonsClickListeners();

    } catch (error) {
        console.error("Error al cargar los datos de los libros:", error);
    }
}

/**
 * Elimina un libro del carrito de compras y actualiza el localStorage.
 *
 * @param {string} bookId - ID del libro a eliminar.
 * @return {void}
 */
function removeFromCart(bookId) {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = cartData.filter(([id]) => id.toString() !== bookId.toString());

    // Actualiza el localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Recarga el carrito en la página
    loadCart();
}

/**
 * Agrega el evento click a los botones de cantidad de cada libro en el carrito.
 * Al hacer click en el botón de disminuir, si la cantidad actual es mayor a 1,
 * disminuye la cantidad actual en 1 y actualiza el total de la fila.
 * Al hacer click en el botón de aumentar, si la cantidad actual es menor a 10,
 * aumenta la cantidad actual en 1 y actualiza el total de la fila.
 */
function addQuantityButtonsClickListeners() {
    document.querySelectorAll(".book-quantity-button").forEach(button => {
        button.addEventListener("click", () => {
            const quantityElement = button.closest('.book-details').querySelector('.book-quantity-value');
            let currentQuantity = parseInt(quantityElement.textContent);

            if (button.id === "decrease" && currentQuantity > 1) {
                quantityElement.textContent = currentQuantity - 1;
                updateCartItemTotal(button);
            }

            if (button.id === "increase" && currentQuantity < 10) {
                quantityElement.textContent = currentQuantity + 1;
                updateCartItemTotal(button);
            }
        });
    });
}

/**
 * Actualiza el total de cada fila del carrito de compras.
 *
 * Dado un botón de cantidad (ya sea de disminuir o aumentar),
 * encuentra el contenedor de la fila del carrito que le corresponde
 * y actualiza el total de la fila con el precio actual multiplicado
 * por la nueva cantidad.
 *
 * @param {HTMLElement} button - Botón de cantidad que dispara el evento.
 * @return {void}
 */
function updateCartItemTotal(button) {
    const bookDetails = button.closest('.book-details');
    const priceElement = bookDetails.querySelector('.book-price');
    const quantityElement = bookDetails.querySelector('.book-quantity-value');
    const totalPriceElement = bookDetails.querySelector('.book-total-price');

    const price = parseFloat(
        priceElement.textContent
            .replace(/[^0-9,-]+/g, "")  // Elimina símbolos
            .replace(",", ".")          // Cambia coma por punto
    );
    const quantity = parseInt(quantityElement.textContent);
    const totalPrice = price * quantity;

    totalPriceElement.textContent = priceFormatter.format(totalPrice);
}

/**
 * Crea un formateador de números para moneda.
 *
 * @param {string} [locale='es-AR'] - Código de idioma para el formateador.
 * @param {string} [currency='ARS'] - Código de moneda para el formateador.
 * @param {number} [minDecimals=2] - Número mínimo de decimales para el formateador.
 * @return {Intl.NumberFormat} - Formateador de números para moneda.
 */
function formatCurrency(locale = 'es-AR', currency = 'ARS', minDecimals = 2) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: minDecimals,
    });
}