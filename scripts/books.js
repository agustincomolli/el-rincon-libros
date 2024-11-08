document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

/**
 * Carga los datos de los libros en el contenedor
 * 
 * Llena el contenedor .books-container con la informaci n de los libros
 * obtenida desde el archivo books.json
 * 
 * @returns {undefined}
 */
function loadData() {
    fetch('/data/books.json')
        .then(response => response.json())
        .then(data => {
            const booksContainer = document.querySelector('.books-container');
            data.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.className = 'book';

                const titleElement = document.createElement('h3');
                titleElement.className = 'book-title';
                titleElement.textContent = book.title;
                bookElement.appendChild(titleElement);

                const authorElement = document.createElement('h4');
                authorElement.className = 'book-author';
                authorElement.textContent = book.author;
                bookElement.appendChild(authorElement);

                const coverElement = document.createElement('a');
                coverElement.href = `./book-details.html?id=${book.id}`;
                coverElement.dataset.bookId = book.id;
                coverElement.innerHTML = `<img class="book-cover" src="../assets/images/${book.cover}" alt="Portada de ${book.title}" height="300px" title="${book.title}">`;
                bookElement.appendChild(coverElement);

                const priceElement = document.createElement('p');
                priceElement.className = 'book-price';
                priceElement.textContent = book.price;
                bookElement.appendChild(priceElement);

                const addToCartElement = document.createElement('a');
                addToCartElement.className = 'add-to-cart-button';
                addToCartElement.href = '#';
                addToCartElement.title = 'Agregar al carrito';
                addToCartElement.innerHTML = '<i class=\'bx bx-cart\'></i>';
                bookElement.appendChild(addToCartElement);

                booksContainer.appendChild(bookElement);
            });
        })
        .catch(error => console.error('Error:', error));
}