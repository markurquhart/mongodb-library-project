document.getElementById('bookForm').addEventListener('submit', addBook);

function addBook(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    fetch('/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            author: author
        })
    })
    .then(response => response.json())
    .then(data => {
        appendBookToList(data);
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
    })
    .catch(error => console.error('Error adding book:', error));
}

function appendBookToList(book) {
    const ul = document.getElementById('bookList');
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(`${book.title} by ${book.author}`));
    ul.appendChild(li);
}

// Initial fetch to populate list
fetch('/books')
    .then(response => response.json())
    .then(data => {
        data.forEach(book => {
            appendBookToList(book);
        });
    })
    .catch(error => console.error('Error fetching books:', error));
