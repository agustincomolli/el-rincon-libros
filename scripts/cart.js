import { formatCurrency } from "./general.js";
const priceFormatter = formatCurrency();
const shippingModal = document.getElementById("shipping-modal");

document.addEventListener("DOMContentLoaded", () => {
    const promotionalCodeButton = document.querySelector("#promotional-code-button");
    const addNodeButton = document.querySelector("#add-note-button");
    const calculateShippingBtn = document.querySelector("#calculate-shipping");
    const closeModalBtn = document.querySelector(".close-modal");
    const updateLocationBtn = document.getElementById("update-location-btn");

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

    calculateShippingBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevenir comportamiento de enlace
        shippingModal.style.display = "block";
    });

    // Cerrar modal
    closeModalBtn.addEventListener("click", () => {
        shippingModal.style.display = "none";
    });

    // Cerrar modal si se hace clic fuera de él
    window.addEventListener("click", (event) => {
        if (event.target === shippingModal) {
            shippingModal.style.display = "none";
        }
    });

    updateLocationBtn.addEventListener("click", updateLocation);

    loadProvinces();

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
        const data = await response.json();

        booksContainer.innerHTML = "";
        let totalCart = 0;
        let subtotalCart = 0;

        cartData.forEach(([bookId, quantity]) => {
            const book = data.find(b => b.id.toString() === bookId.toString());
            if (book) {
                const bookPrice = book.price;
                const totalPrice = bookPrice * quantity;
                subtotalCart += totalPrice;

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
                            <button class="book-quantity-button" id="decrease" title="Disminuir"><i class="bx bx-minus"></i></button>
                            <span class="book-quantity-value">${quantity}</span>
                            <button class="book-quantity-button" id="increase" title="Aumentar"><i class="bx bx-plus"></i></button>
                        </div>
                        <div class="book-total">
                            <span class="book-total-price">${priceFormatter.format(totalPrice)}</span>
                        </div>
                        <button class="book-remove-button" data-book-id="${bookId}" title="Eliminar"><i class="bx bx-trash"></i></button>
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

        updateSubtotal()

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
            const quantityElement = button.closest(".book-details").querySelector(".book-quantity-value");
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
    const bookDetails = button.closest(".book-details");
    const priceElement = bookDetails.querySelector(".book-price");
    const quantityElement = bookDetails.querySelector(".book-quantity-value");
    const totalPriceElement = bookDetails.querySelector(".book-total-price");

    const price = parseFloat(
        priceElement.textContent
            .replace(/[^0-9,-]+/g, "")  // Elimina símbolos
            .replace(",", ".")          // Cambia coma por punto
    );
    const quantity = parseInt(quantityElement.textContent);
    const totalPrice = price * quantity;

    totalPriceElement.textContent = priceFormatter.format(totalPrice);

    updateSubtotal()
}

/**
 * Actualiza el subtotal del carrito de compras.
 *
 * Busca todos los libros en el carrito, encuentra el total de cada uno
 * y lo suma al subtotal. Luego, actualiza el elemento de la interfaz
 * que muestra el subtotal con el nuevo valor.
 *
 * @return {void}
 */
function updateSubtotal() {
    const subtotalElement = document.querySelector(".cart-subtotal dd");
    const books = document.querySelectorAll(".book");
    let subtotal = 0;

    books.forEach(book => {
        const bookTotalElement = book.querySelector(".book-total-price");
        const bookTotal = parseFloat(
            bookTotalElement.textContent
                .replace(/[^0-9,-]+/g, "")  // Elimina símbolos
                .replace(",", ".")          // Cambia coma por punto
        );
        subtotal += bookTotal;
    });

    subtotalElement.textContent = `${priceFormatter.format(subtotal)}`;
    
    // Recalcular total
    updateTotal();
}

/**
 * Carga las provincias de Argentina en un select desde la API
 * de datos.gob.ar. Ordena las provincias alfabéticamente y
 * las agrega al select.
 *
 * @return {void}
 */
async function loadProvinces() {
    try {
        const provincesSelect = document.getElementById("provinces-select");
        const response = await fetch("http://apis.datos.gob.ar/georef/api/provincias");
        const data = await response.json();

        // Ordenar provincias alfabéticamente
        const sortedProvinces = data.provincias.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
        );

        // Limpiar select existente
        provincesSelect.innerHTML = "<option value=''>Selecciona una provincia</option>";

        // Llenar el select con provincias
        sortedProvinces.forEach(provincia => {
            const option = document.createElement("option");
            option.value = provincia.id;
            option.textContent = provincia.nombre;
            provincesSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar provincias:", error);
        provincesSelect.innerHTML = "<option>Error al cargar provincias</option>";
    }
}

/**
 * Actualiza el costo del envío y el total del pedido en función de la provincia
 * seleccionada en el select.
 *
 * @return {void}
 */
function updateLocation() {
    const provincesSelect = document.getElementById("provinces-select");
    const selectedProvince = provincesSelect.options[provincesSelect.selectedIndex].text;
    if (selectedProvince && selectedProvince !== "Selecciona una provincia") {
        // Aquí podrías calcular el costo de envío según la provincia
        const shipping = calculateShipping(selectedProvince);

        // Actualizar elemento de envío en el resumen del pedido
        const sendElement = document.querySelector(".cart-shipping-value");
        if (sendElement) {
            sendElement.textContent = priceFormatter.format(shipping);
        }

        // Recalcular total
        updateTotal(shipping);

        shippingModal.style.display = "none";
    } else {
        const alertElement = document.querySelector(".alert");
        alertElement.classList.remove("hidden");
    }
}

/**
 * Calcula el costo de envío según la provincia seleccionada.
 *
 * @param {string} provincia - Nombre de la provincia
 * @return {number} Costo de envío
 */
function calculateShipping(province) {
    // Lógica de cálculo de envío. $ 6.000 le puse de ejemplo.
    const baseRate = 6000;
    const factors = {
        "Buenos Aires": 1.2,
        "Ciudad Autónoma de Buenos Aires": 1,
        "Entre Ríos": 1.3,
        "Santa Fe": 1.3,
        "La Pampa": 1.3,
        "Córdoba": 1.4,
        "Corrientes": 1.4,
        // Agregar más provincias con sus factores
    };

    return baseRate * (factors[province] || 1.5);
}

/**
 * Actualiza el total del pedido en la interfaz de usuario.
 *
 * @return {void}
 */
function updateTotal() {
    const subtotalElement = document.querySelector(".cart-subtotal-value");
    const shippingElement = document.querySelector(".cart-shipping-value");
    const totalElement = document.querySelector(".total-value");

    const subtotal = parseFloat(
        subtotalElement.textContent
            .replace(/[^0-9,-]+/g, "")  // Elimina símbolos
            .replace(",", ".")          // Cambia coma por punto

    );

    const shipping = parseFloat(
        shippingElement.textContent
            .replace(/[^0-9,-]+/g, "")  // Elimina símbolos
            .replace(",", ".")          // Cambia coma por punto

    );

    const total = subtotal + shipping;

    if (totalElement) {
        totalElement.textContent = priceFormatter.format(total);
    }
}