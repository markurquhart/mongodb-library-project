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

                // Reload the books after adding a new one
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
        console.log("Fetching books...");
        try {
            const response = await fetch("/books");

            if (response.ok) {
                const books = await response.json();
                console.log("Books fetched:", books);
                // Clear previous books and display new list
                bookList.innerHTML = '';
                books.forEach(addBookToList);
            } else {
                console.error("Failed to fetch books: Server returned non-OK status");
                notifyUser("Failed to fetch the list of books.", "error");
            }
        } catch (error) {
            console.error("Error fetching books:", error);
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
        notification.className = type;
        setTimeout(() => {
            notification.textContent = "";
            notification.className = "";
        }, 3000);
    };

    // Load the list of books when the page is loaded
    loadBooks();
});
