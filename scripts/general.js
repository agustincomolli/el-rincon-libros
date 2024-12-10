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