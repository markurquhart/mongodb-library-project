document.getElementById('bookForm').addEventListener('submit', function(event) {
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
        console.log('Book added:', data);
        // Clear the form fields
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        // Reload the books
        loadBooks();
    })
    .catch(error => console.error('Error adding book:', error));
});

function loadBooks() {
    fetch('/books')
        .then(response => response.json())
        .then(data => displayBooks(data))
        .catch(error => console.error('Error fetching books:', error));
}

function displayBooks(books) {
    const booksDiv = document.getElementById('booksList');
    booksDiv.innerHTML = ''; // Clear the current list
    
    books.forEach(book => {
        const bookCard = `
        <div class="card mt-3">
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">${book.author}</p>
            </div>
        </div>`;
        booksDiv.innerHTML += bookCard;
    });
}

// Initial load of books
loadBooks();
