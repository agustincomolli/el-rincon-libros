let alert = document.querySelector(".status-message");
let contactForm = document.querySelector("#contact-form");

// Cuando el DOM esté completamente cargado.
document.addEventListener("DOMContentLoaded", () => {
    contactForm.addEventListener("submit", submitForm);
});

/**
 * Maneja el envío del formulario de contacto.
 *
 * @param {Event} event Evento submit del formulario.
 */
async function submitForm(event) {
    // Prevenir el envío del formulario para evitar una recarga de página.
    event.preventDefault();

    // Obtener referencia al formulario.
    const form = event.target;

    // Obtener los datos del formulario.
    const dataContact = new FormData(form);

    // Inicializar variables para el título y mensaje  y el tipo de la alerta.
    let alertTitle = "";
    let alertMessage = "";
    let alertClass = "";

    // Enviar los datos del formulario al servidor de manera asíncrona.
    const response = await fetch(form.action, {
        method: form.method,
        body: dataContact,
        headers: {
            "Accept": "application/json"
        }
    });

    // Verificar si la respuesta del servidor es exitosa (código de respuesta 200).
    if (response.ok) {
        // Restablecer el formulario después de un envío exitoso.
        form.reset();
        alertTitle = "Su mensaje ha sido enviado exitosamente";
        alertMessage = "¡Gracias por contactarte conmigo 😀!<br> Pronto nos comunicaremos.";
        alertClass = "ok";
    } else {
        alertTitle = "Su mensaje no pudo enviarse";
        alertMessage = "¡Ups! Hubo un problema al enviar su formulario 😥";
        alertClass = "error";
    }
    
    // Mostrar el mensaje de estado.
    document.querySelector(".alert-title").innerHTML = alertTitle;
    document.querySelector(".alert-message").innerHTML = alertMessage;
    alert.classList.add(alertClass);
    
    // Ocultar el mensaje de estado luego de 5 segundos, generando una animación.
    setTimeout(() => {
        alert.classList.add("hidden");
        setTimeout(() => {
            alert.classList.remove(alertClass);
            alert.classList.remove("hidden");
        }, 500);
    }, 5000);
};
