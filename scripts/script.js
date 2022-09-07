// Class for books
class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  // This object will contain all the books
  static myLibrary = {};

  // used to capitalize book properties
  static capitalize(word) {
    return word.replace(/\w/, (letter) => letter.toUpperCase());
  }

  // stores book in myLibrary object
  addToLibrary() {
    Book.myLibrary[this.title] = this;
  }

  // Adds book into into a table, appends it to DOM and displays it on webpage.
  display() {
    // adds divs with book information to library section
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    // creates table
    const bookTable = document.createElement("table");
    bookDiv.appendChild(bookTable);
    const tableBody = document.createElement("tbody");
    bookTable.appendChild(tableBody);
    tableBody.classList.add("book-table");
    Object.keys(this).forEach((property) => {
      // dont display prototype properties
      // create table row
      const tableRow = document.createElement("tr");
      tableBody.appendChild(tableRow);
      // format property to be suitable for display
      const formattedProperty = `${Book.capitalize(property)}:`;
      // add info to tableRow
      [formattedProperty, this[property]].forEach((text) => {
        if (text !== "Title:") {
          const tableData = document.createElement("td");
          // format "Read" booleans to image
          if (typeof text !== "boolean") {
            tableData.innerText = text;
          } else {
            this.addReadButton(tableData);
          }
          tableRow.appendChild(tableData);
        }
      });
    });
    this.addDeleteButton(bookDiv);

    website.librarySection.prepend(bookDiv);
  }

  addDeleteButton(location) {
    // make space for delete button
    const trashBin = document.createElement("span");
    trashBin.classList.add("trash-bin");
    location.appendChild(trashBin);
    // add button functionality
    trashBin.addEventListener("click", () => {
      this.remove(location);
    });
  }

  remove(book) {
    // remove from Dom
    website.librarySection.removeChild(book);
    // remove from myLibrary object
    delete Book.myLibrary[this.title];
  }

  addReadButton(location) {
    // make space for delete button
    const imageRead = document.createElement("div");
    imageRead.classList.add("image-read");
    if (this.read) {
      imageRead.classList.add("read-it");
    }
    location.appendChild(imageRead);
    // add button functionality
    imageRead.addEventListener("click", () => {
      imageRead.classList.toggle("read-it");
      this.read = !this.read; // toggle read status on object with button
    });
  }

  // correct value data types for number of pages and read.
  correctData() {
    this.pages = parseInt(this.pages, 10); // to number
    // to boolean
    if (this.read === undefined) {
      this.read = false;
    } else {
      this.read = true;
    }
    return this;
  }
}

const website = (function () {
  const root = document.querySelector("html");
  const body = document.querySelector("#page-body");
  const librarySection = document.querySelector("main");
  const darkModeSwitch = document.querySelector("#dark-mode");
  const darkModeSwitchDiv = document.querySelector("#dark-mode-switch-div");
  const newBookButton = document.querySelector("#book-button");
  const popUp = document.querySelector("#pop-up");
  const addBookButton = document.querySelector("#add-book-button");
  const closePopUpButton = document.querySelector("#close-pop-up");
  const addBookForm = document.querySelector("#add-book-form");
  const inputsForm = document.querySelectorAll("#add-book-form input");

  // displays all books in list
  function displayAllBooks(library = Book.myLibrary) {
    Object.keys(Book.myLibrary).forEach((book) => {
      library[book].display();
    });
  }

  function togglePopup() {
    // clear form
    addBookForm.reset();

    popUp.classList.toggle("visible-pop-up");
    body.classList.toggle("greyout");
    newBookButton.classList.toggle("active-button");
    darkModeSwitchDiv.classList.toggle("inactive-switch");
    if (newBookButton.disabled) {
      newBookButton.disabled = false;
      darkModeSwitch.disabled = false;
    } else {
      newBookButton.disabled = true;
      darkModeSwitch.disabled = true;
    }
  }

  function addAllListeners() {
    // change to dark mode with button
    darkModeSwitch.addEventListener("click", () => {
      root.classList.toggle("dark");
    });

    // show popup when pressing "+" button
    newBookButton.addEventListener("click", togglePopup);

    // add book to library with button on pop-up
    addBookButton.addEventListener("click", (e) => {
      if (addBookForm.checkValidity()) {
        // prevents button from submitting
        e.preventDefault();
        // extract data from form and make it a FormData
        const formData = new FormData(addBookForm);
        const addBookData = Object.fromEntries(formData.entries());
        // create book from data
        const newBook = Object.assign(new Book(), addBookData);

        const correctedBook = newBook.correctData();

        correctedBook.display();
        togglePopup();
        Book.myLibrary[correctedBook.title] = correctedBook;
      }
    });

    closePopUpButton.addEventListener("click", togglePopup);

    // inputs in add book form
    inputsForm.forEach((input) => {
      input.addEventListener("input", () => {
        input.setCustomValidity("");
        input.checkValidity();
      });
    });

    // when an input is invalid, show a custom message

    inputsForm[0].addEventListener("invalid", (e) => {
      const titleInput = e.target;
      if (titleInput.validity.valueMissing) {
        titleInput.setCustomValidity("Please write the book's title");
      }
    });

    inputsForm[1].addEventListener("invalid", (e) => {
      const authorInput = e.target;
      if (authorInput.validity.valueMissing) {
        authorInput.setCustomValidity("Please write the author's name");
      }
    });

    inputsForm[2].addEventListener("invalid", (e) => {
      const pagesInput = e.target;
      if (pagesInput.validity.valueMissing) {
        pagesInput.setCustomValidity(
          "Please write the number of pages in the book"
        );
      } else if (pagesInput.validity.rangeUnderflow) {
        pagesInput.setCustomValidity("The book must have at least 1 page!");
      }
    });
  }

  addAllListeners();

  return { librarySection, displayAllBooks };
})();

new Book("The Hobbit", "J.R.R. Tolkien", 310, true).addToLibrary();
new Book("Pedro Páramo", "Juan Rulfo", 128, false).addToLibrary();
new Book("La Raza Cósmica", "José Vasconcelos", 70, true).addToLibrary();
new Book(
  "The principles of Object-Oriented Javascript",
  "Nicholas C. Zakas",
  112,
  false
).addToLibrary();

website.displayAllBooks();
