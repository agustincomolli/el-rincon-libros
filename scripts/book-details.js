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
function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");
    const bookDetails = document.querySelector(".book-details");

    // Mostrar el detalle del libro.
    bookDetails.style.display = "flex";

    fetch("/data/books.json")
        .then(response => response.json())
        .then(data => {
            const book = data.find(book => book.id === bookId);
            if (book) {
                // Carga los datos del libro en la página
                document.querySelector("#book-title").textContent = book.title;
                document.querySelector(".book-author").textContent = book.author;
                document.querySelector(".book-description").textContent = book.description;
                document.querySelector(".book-price").textContent = book.price;
                document.querySelector(".book-image").setAttribute("src", `../assets/images/${book.cover}`);
                document.querySelector(".book-image").setAttribute("alt", `Portada de ${book.title}`);
                document.querySelector(".book-image").setAttribute("title", `Portada de ${book.title}`);
                document.querySelector("#book-genre").textContent = `Género:  ${book.genre}`;
                document.querySelector("#book-year").textContent = `Publicado en: ${book.publicationDate}`;
                document.querySelector("#book-pages").textContent = `Páginas: ${book.pages}`;
                document.querySelector("#book-publisher").textContent = `Editorial: ${book.publisher}`;
                document.querySelector("#book-isbn").textContent = `ISBN: ${book.isbn}`;
            } else {
                // Libro no encontrado
                console.error("Libro no encontrado");
                window.location.href = "../pages/error-404.html";
            }
        })
        .catch(error => console.error("Error:", error));
};