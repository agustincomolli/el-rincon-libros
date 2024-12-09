document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});

/**
 * Carga el carrito de compras desde el localStorage y
 * muestra los libros en la página.
 *
 * @return {void}
 */
function loadCart() {
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

    // Formateador de precios para Argentina
    const priceFormatter = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
    });

    fetch("../data/books.json")
        .then(response => response.json())
        .then(books => {
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
                                <button class="book-quantity-button" title="Disminuir"><i class='bx bx-minus'></i></button>
                                <span class="book-quantity-value">${quantity}</span>
                                <button class="book-quantity-button" title="Aumentar"><i class='bx bx-plus'></i></button>
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
        })
        .catch(error => console.error("Error al cargar los datos de los libros:", error));
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