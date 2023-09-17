function loadBooks() {
    fetch('/books')
    .then(response => response.json())
    .then(books => {
        const booksList = document.getElementById('booksList');
        booksList.innerHTML = ''; // Clear any existing books
        
        books.forEach(book => {
            const bookItem = document.createElement('li');
            bookItem.textContent = `${book.title} by ${book.author}`;
            booksList.appendChild(bookItem);
        });
    })
    .catch(error => {
        console.error('Error fetching books:', error);
    });
}

// Call the function immediately to load books on page load
loadBooks();

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
        alert('Book added successfully!');
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        
        loadBooks(); // Refresh the list of books
    })
    .catch(error => {
        console.error('Error adding book:', error);
    });
});
