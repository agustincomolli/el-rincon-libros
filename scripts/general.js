
// Ejecutar la verificación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', checkCartItems);

// También es útil escuchar eventos de cambio en localStorage
window.addEventListener('storage', (event) => {
    if (event.key === 'cart') {
        console.log("Carrito de compras actualizado");
        checkCartItems();
    }
});

/**
 * Verifica si hay items en el carrito de compras y
 * muestra o esconde el conteo de items en la navegación.
 *
 * @return {void}
 */
export function checkCartItems() {
    // Seleccionar el icono del carrito
    const cartIcon = document.querySelector('.nav-link.cart-icon');

    // Si no hay icono del carrito en la página, no hacer nada
    if (!cartIcon) return;

    // Obtener el carrito de localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (cart && cart.length > 0) {
        const cartCount = cart.length;

        // Crear o actualizar el span de conteo
        let cartCountSpan = cartIcon.querySelector('.cart-count');

        if (!cartCountSpan) {
            cartCountSpan = document.createElement('span');
            cartCountSpan.classList.add('cart-count');
            cartIcon.appendChild(cartCountSpan);
        }

        // Mostrar "9+" si hay más de 9 items
        cartCountSpan.textContent = cartCount > 9 ? '9+' : cartCount;
    } else {
        // Eliminar el span de conteo si no hay items
        const cartCountSpan = cartIcon.querySelector('.cart-count');
        if (cartCountSpan) {
            cartCountSpan.remove();
        }
    }
}

/**
 * Crea un formateador de números para moneda.
 *
 * @param {string} [locale='es-AR'] - Código de idioma para el formateador.
 * @param {string} [currency='ARS'] - Código de moneda para el formateador.
 * @param {number} [minDecimals=2] - Número mínimo de decimales para el formateador.
 * @return {Intl.NumberFormat} - Formateador de números para moneda.
 */
export function formatCurrency(locale = 'es-AR', currency = 'ARS', minDecimals = 2) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: minDecimals,
    });
}

