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
            } else {
                notifyUser("Failed to add the book. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            notifyUser("Failed to add the book. Please check your server.", "error");
        }
    });

    const loadBooks = async () => {
        try {
            const response = await fetch("/books");

            if (response.ok) {
                const books = await response.json();
                books.forEach(addBookToList);
            } else {
                notifyUser("Failed to fetch the list of books.", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            notifyUser("Failed to fetch the list of books. Please check your server.", "error");
        }
    };

    const addBookToList = (book) => {
        const bookItem = document.createElement("li");
        bookItem.textContent = `${book.title} by ${book.author}`;
        bookList.appendChild(bookItem);
    };

    const notifyUser = (message, type) => {
        notification.textContent = message;
        notification.className = type; // This will help you style success and error messages differently
        setTimeout(() => {
            notification.textContent = "";
            notification.className = "";
        }, 3000);
    };

    // Load the list of books when the page is loaded
    loadBooks();
});