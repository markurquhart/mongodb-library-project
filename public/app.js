document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("book-form");
    const bookTableBody = document.getElementById("book-list-table-body");
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
                addBookToTable(addedBook);
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

    const loadBooks = async () => {
        try {
            const response = await fetch("/books");

            if (response.ok) {
                const books = await response.json();
                bookTableBody.innerHTML = '';  // Clear the table
                books.forEach(addBookToTable);
            } else {
                notifyUser("Failed to fetch the list of books.", "error");
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            notifyUser("Failed to fetch the list of books. Please check your server.", "error");
        }
    };

    const addBookToTable = (book) => {
        const row = bookTableBody.insertRow();

        const titleCell = row.insertCell(0);
        titleCell.textContent = book.title;

        const authorCell = row.insertCell(1);
        authorCell.textContent = book.author;

        const addedCell = row.insertCell(2);
        addedCell.textContent = new Date(book.dateAdded).toLocaleString();

        const editCell = row.insertCell(3);
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "btn btn-warning";
        editCell.appendChild(editButton);

        const deleteCell = row.insertCell(4);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-danger";
        deleteCell.appendChild(deleteButton);
    };

    const notifyUser = (message, type) => {
        notification.textContent = message;
        notification.className = `alert alert-${type}`;
        setTimeout(() => {
            notification.textContent = "";
            notification.className = "";
        }, 3000);
    };

    loadBooks();
});
