// Obtener los datos de los libros del contenedor books-container
const booksContainer = document.querySelector('.books-container');
const books = Array.from(booksContainer.querySelectorAll('.book')).map(book => {
    const id = book.querySelector("a").getAttribute("data-book-id");
    const title = book.querySelector('.book-title').textContent;
    const author = book.querySelector('.book-author').textContent;
    const price = book.querySelector('.book-price').textContent;
    const cover = book.querySelector('.book-cover').src;
    return { id, title, author, price, cover };
});

// Guardar los datos en un archivo JSON
const jsonData = JSON.stringify(books);
const fileName = 'books.json';
const file = new File([new Blob([jsonData], { type: 'application/json' })], fileName);
const a = document.createElement('a');
a.href = URL.createObjectURL(file);
a.download = fileName;
a.click();
