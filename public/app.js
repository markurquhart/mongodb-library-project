document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("book-form");
    const bookList = document.querySelector("#book-list tbody");
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

    const editBook = async (bookId) => {
        const title = prompt("Enter the new title for the book:");
        const author = prompt("Enter the new author for the book:");
    
        if (!title || !author) {
            notifyUser("Both title and author are required!", "error");
            return;
        }
    
        try {
            const response = await fetch(`/books/${bookId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, author })
            });
    
            if (response.ok) {
                loadBooks();
                notifyUser("Book updated successfully!", "success");
            } else {
                notifyUser("Failed to update the book. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error during book update:", error);
            notifyUser("Failed to update the book. Please check your server.", "error");
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
    
        // Title cell with input for editing
        const titleTd = document.createElement('td');
        const titleSpan = document.createElement('span'); // Create a span for text
        titleSpan.textContent = book.title;
        const titleInput = document.createElement('input');
        titleInput.value = book.title;
        titleInput.className = "form-control";
        titleInput.style.display = 'none'; // Initially hidden
    
        titleTd.appendChild(titleSpan);  // Append span to td
        titleTd.appendChild(titleInput);
        row.appendChild(titleTd);
    
        // Author cell with input for editing
        const authorTd = document.createElement('td');
        const authorSpan = document.createElement('span'); // Create a span for text
        authorSpan.textContent = book.author;
        const authorInput = document.createElement('input');
        authorInput.value = book.author;
        authorInput.className = "form-control author-input";  // Assign the class for easier selection later
        authorInput.style.display = 'none'; // Initially hidden
    
        authorTd.appendChild(authorSpan); // Append span to td
        authorTd.appendChild(authorInput);
        row.appendChild(authorTd);
    
        // Created Date cell
        const createdTd = document.createElement('td');
        createdTd.textContent = new Date(book.createdAt).toLocaleString();
        row.appendChild(createdTd);

        // Last Modified Date cell
        const updatedTd = document.createElement('td');
        if (book.updatedAt) {
            updatedTd.textContent = new Date(book.updatedAt).toLocaleString();
        } else {
            updatedTd.textContent = "Never updated";
        }
        row.appendChild(updatedTd);

    
       // Edit/Update cell
        const editTd = document.createElement('td');
        const editButton = document.createElement('button');

        editButton.textContent = 'Edit';
        editButton.className = 'btn btn-warning';
        editButton.onclick = async function() {
            if (editButton.textContent === 'Edit') {
                editButton.textContent = 'Update';
                editButton.className = 'btn btn-success';

                titleSpan.style.display = 'none';
                titleInput.style.display = 'block';
                titleInput.focus();  // This will put the cursor in the title input field

                authorSpan.style.display = 'none';
                authorInput.style.display = 'block';
            } else {
                // Updating the book on the server before updating the visuals
                try {
                    const response = await fetch(`/books/${book._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ title: titleInput.value, author: authorInput.value })
                    });

                    if (response.ok) {
                        // Successful update
                        loadBooks();
                        notifyUser("Book updated successfully!", "success");
                    } else {
                        notifyUser("Failed to update the book. Please try again.", "error");
                    }
                } catch (error) {
                    console.error("Error during book update:", error);
                    notifyUser("Failed to update the book. Please check your server.", "error");
                }
            }
        };

        editTd.appendChild(editButton);
        row.appendChild(editTd);
    
        // Delete cell
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
