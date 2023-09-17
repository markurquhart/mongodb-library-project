document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("book-form");
    const bookList = document.getElementById("book-list");
    const notification = document.getElementById("notification");

    bookForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = e.target.elements.title.value.trim();
        const author = e.target.elements.author.value.trim();

        if (!title || !author) {
            notifyUser("Both title and author are required!", "error");
            return;
        }

        try {
            const response = await fetch("/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, author })
            });

            if (response.ok) {
                const addedBook = await response.json();
                addBookToList(addedBook);
                notifyUser("Book added successfully!", "success");
                bookForm.reset();
                loadBooks();
            } else {
                notifyUser("Failed to add the book. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error during book addition:", error);
            notifyUser("Failed to add the book. Please check your server.", "error");
        }
    });

    const deleteBook = async (bookId) => {
        try {
            const response = await fetch(`/books/${bookId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                loadBooks();
                notifyUser("Book deleted successfully!", "success");
            } else {
                notifyUser("Failed to delete the book. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error during book deletion:", error);
            notifyUser("Failed to delete the book. Please check your server.", "error");
        }
    };

    const loadBooks = async () => {
        try {
            const response = await fetch("/books");

            if (response.ok) {
                const books = await response.json();
                bookList.innerHTML = '';  // Clear the list
                books.forEach(addBookToList);
            } else {
                notifyUser("Failed to fetch the list of books.", "error");
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            notifyUser("Failed to fetch the list of books. Please check your server.", "error");
        }
    };

    const addBookToList = (book) => {
        const row = document.createElement('tr');
        const titleTd = document.createElement('td');
        titleTd.textContent = book.title;
        row.appendChild(titleTd);

        const authorTd = document.createElement('td');
        authorTd.textContent = book.author;
        row.appendChild(authorTd);

        const timestampTd = document.createElement('td');
        timestampTd.textContent = new Date(book.createdAt).toLocaleString();
        row.appendChild(timestampTd);

        const editTd = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn btn-warning';
        // TODO: Add edit functionality
        editTd.appendChild(editButton);
        row.appendChild(editTd);

        const deleteTd = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-danger';
        deleteButton.onclick = () => deleteBook(book._id);
        deleteTd.appendChild(deleteButton);
        row.appendChild(deleteTd);

        bookList.appendChild(row);
    };

    const notifyUser = (message, type) => {
        notification.textContent = message;
        notification.className = type;
        setTimeout(() => {
            notification.textContent = "";
            notification.className = "";
        }, 3000);
    };

    loadBooks();
});
