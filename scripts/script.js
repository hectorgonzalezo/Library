
const DOM = class {
root = document.querySelector('html');
body = document.querySelector('#page-body');
librarySection = document.querySelector('main');
darkModeSwitch = document.querySelector('#dark-mode');
darkModeSwitchDiv = document.querySelector('#dark-mode-switch-div');
newBookButton = document.querySelector('#book-button');
popUp = document.querySelector('#pop-up');
addBookButton = document.querySelector('#add-book-button');
closePopUpButton = document.querySelector('#close-pop-up');
addBookForm = document.querySelector('#add-book-form');


//displays all books in list
displayAllBooks(library = Book.myLibrary) {
    Object.keys(Book.myLibrary).forEach((book) => {
        library[book].display();
    }
    )
};


togglePopup() {

    //clear form
    this.addBookForm.reset();

    this.popUp.classList.toggle('visible-pop-up');
    this.body.classList.toggle('greyout');
    this.newBookButton.classList.toggle('active-button');
    this.darkModeSwitchDiv.classList.toggle('inactive-switch');
    if (this.newBookButton.disabled) {
        this.newBookButton.disabled = false;
        this.darkModeSwitch.disabled = false;
    } else {
        this.newBookButton.disabled = true;
        this.darkModeSwitch.disabled = true;
    }
}

addAllListeners() {
    //change to dark mode with button
    this.darkModeSwitch.addEventListener('click', () => {
        this.root.classList.toggle("dark")
    });


    //show popup when pressing "+" button
    this.newBookButton.addEventListener('click', () => this.togglePopup())


    //add book to library with button on pop-up
    this.addBookButton.addEventListener('click', (e) => {
        //prevents button from submitting
        e.preventDefault();

        if (this.addBookForm.checkValidity()) {
            //extract data from form and make it a FormData
            const formData = new FormData(this.addBookForm);
            const addBookData = Object.fromEntries(formData.entries());
            //create book from data
            const newBook = Object.assign(new Book(), addBookData);

            const correctedBook = newBook.correctData();

            correctedBook.display();
            this.togglePopup();
            Book.myLibrary[correctedBook['title']] = correctedBook
        }
    })

    this.closePopUpButton.addEventListener('click', () => this.togglePopup())
}
}

//Class for books
class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    };
    //This object will contain all the books
    static myLibrary = {};

    //used to capitalize book properties
    static capitalize(word) {
        return word.replace(/\w/, (letter) => letter.toUpperCase());
    }

    //stores book in myLibrary object
    addToLibrary() {
        Book.myLibrary[this.title] = this;
    }


    //Adds book into into a table, appends it to DOM and displays it on webpage.
    display() {
        //adds divs with book information to library section
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        //creates table
        const bookTable = document.createElement('table');
        bookDiv.appendChild(bookTable);
        const tableBody = document.createElement('tbody');
        bookTable.appendChild(tableBody);
        tableBody.classList.add('book-table');
        for (const property in this) {
            if (this.hasOwnProperty(property)) {//dont display prototype properties
                //create table row
                const tableRow = document.createElement('tr');
                tableBody.appendChild(tableRow);
                //format property to be suitable for display
                const formattedProperty = `${Book.capitalize(property)}:`;
                //add info to tableRow
                [formattedProperty, this[property]].forEach((text) => {
                    if (text != 'Title:') {
                        const tableData = document.createElement('td');
                        //format "Read" booleans to image
                        if (typeof (text) != 'boolean') {
                            tableData.innerText = text;
                        } else {
                            this.addReadButton(tableData);
                        }
                        tableRow.appendChild(tableData);
                    }
                }
                )
            }
        }
        this.addDeleteButton(bookDiv);

        website.librarySection.prepend(bookDiv);
    }

    addDeleteButton(location) {
        //make space for delete button
        const trashBin = document.createElement('span');
        trashBin.classList.add('trash-bin');
        location.appendChild(trashBin);
        //add button functionality
        trashBin.addEventListener('click', () => {
            this.remove(location);
        })
    }

    remove(book) {
        //remove from Dom
        website.librarySection.removeChild(book);
        //remove from myLibrary object
        delete Book.myLibrary[this['title']]
    }

    addReadButton(location) {
        //make space for delete button
        const imageRead = document.createElement('div');
        imageRead.classList.add('image-read');
        this.read ? imageRead.classList.add('read-it') : null;
        location.appendChild(imageRead);
        //add button functionality
        imageRead.addEventListener('click', (e) => {
            imageRead.classList.toggle('read-it');
            this.read = this.read ? false : true;//toggle read status on object with button
        })
    }

    //correct value data types for number of pages and read.
    correctData() {
        this.pages = parseInt(this.pages) //to number
        //to boolean
        if (this.read == undefined) {
            this.read = false;
        } else {
            this.read = true;
        };
        return this
    }
}





const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 310, true).addToLibrary();
const pedroParamo = new Book('Pedro Páramo', 'Juan Rulfo', 128, false).addToLibrary();
const razaCosmica = new Book('La Raza Cósmica', 'José Vasconcelos', 70, true).addToLibrary();
const principles = new Book("The principles of Object-Oriented Javascript", 'Nicholas C. Zakas', 112, false).addToLibrary();

const website = new DOM();

website.displayAllBooks();
website.addAllListeners();