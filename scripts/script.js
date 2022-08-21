const root = document.querySelector('html')
const body = document.querySelector('#page-body')
const librarySection = document.querySelector('main')
const darkModeSwitch = document.querySelector('#dark-mode')
const darkModeSwitchDiv = document.querySelector('#dark-mode-switch-div')
const newBookButton = document.querySelector('#book-button')
const popUp = document.querySelector('#pop-up')
const addBookButton = document.querySelector('#add-book-button')
const closePopUpButton = document.querySelector('#close-pop-up')
const addBookForm = document.querySelector('#add-book-form')

//This object will contain all the books
let myLibrary = {}

//object constructor for books
function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
}


//takes users input and stores a new book in the array myLibrary.
function addBookToArray(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read)
    myLibrary[title] = newBook;
}

addBookToArray('The Hobbit', 'J.R.R. Tolkien', 310, true)
addBookToArray('Pedro Páramo', 'Juan Rulfo', 128, false)
addBookToArray('La Raza Cósmica', 'José Vasconcelos', 70, true)
addBookToArray("The principles of Object-Oriented Javascript", 'Nicholas C. Zakas', 112, false)

//used to capitalize book properties
function capitalize(word) {
    return word.replace(/\w/, (letter) => letter.toUpperCase())
}

//Adds book into into a table, appends it to DOM and displays it on webpage.
function displayBook(book) {
    //adds divs with book information to library section
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');

    //creates table
    const bookTable = document.createElement('table')
    bookDiv.appendChild(bookTable)
    const tableBody = document.createElement('tbody')
    bookTable.appendChild(tableBody)
    tableBody.classList.add('book-table')
    for (const property in book) {
        //create table row
        const tableRow = document.createElement('tr');
        tableBody.appendChild(tableRow)
        //format property to be suitable for display
        const formattedProperty = `${capitalize(property)}:`;
        //add info to tableRow
        [formattedProperty, book[property]].forEach((text) => {
            if (text != 'Title:') {
                const tableData = document.createElement('td');
                //format "Read" booleans to image
                if (typeof (text) != 'boolean') {
                    tableData.innerText = text;
                } else {
                    addReadButton(tableData, book)
                }
                tableRow.appendChild(tableData)
            }
        }
        )
    }
    addDeleteButton(bookDiv, book)

    librarySection.prepend(bookDiv)
}

function addDeleteButton (location, obj) {
    //make space for delete button
    const trashBin = document.createElement('span')
    trashBin.classList.add('trash-bin')
    location.appendChild(trashBin)
    //add button functionality
    trashBin.addEventListener('click', () => {
        removeBook(location, obj)
    })
}

function addReadButton (location, book) {
   //make space for delete button
    const imageRead = document.createElement('div');
    imageRead.classList.add('image-read')
    book.read ? imageRead.classList.add('read-it') : null;
    location.appendChild(imageRead)
   //add button functionality
   imageRead.addEventListener('click', (e) => {
       imageRead.classList.toggle('read-it');
       book.read = book.read ? false : true;//toggle read status on object with button
   }) 
}

function removeBook(book, obj) {
    //remove from Dom
    librarySection.removeChild(book);
    //remove from myLibrary object
    delete myLibrary[obj['title']]
}

//displays all books in list
function displayAllBooks(obj = myLibrary) {
    Object.keys(obj).forEach((book, i) => {
        //create book element as div
        displayBook(obj[book], i)
    }
    );
}
displayAllBooks()

//correct value data types for number of pages and read.
function correctBookData(book) {
    const newBook = book;
    newBook.pages = parseInt(newBook.pages) //to number
    //to boolean
    if (newBook.read == undefined) {
        newBook.read = false;
    } else {
        newBook.read = true;
    };
    return newBook
}

function togglePopup() {
    //clear form
    addBookForm.reset();
    
    popUp.classList.toggle('visible-pop-up');
    body.classList.toggle('greyout');
    newBookButton.classList.toggle('active-button');
    darkModeSwitchDiv.classList.toggle('inactive-switch');
    if (newBookButton.disabled){
        newBookButton.disabled = false;
        darkModeSwitch.disabled = false;
    } else {
    newBookButton.disabled = true;
    darkModeSwitch.disabled = true;
    }
}

//change to dark mode with button
darkModeSwitch.addEventListener('click', () => {
    root.classList.toggle("dark")
});


//show popup when pressing "+" button
newBookButton.addEventListener('click', togglePopup)


//add book to library with button on pop-up
addBookButton.addEventListener('click', (e) => {
    //prevents button from submitting
    e.preventDefault();

    if (addBookForm.checkValidity()) {
        //extract data from form and make it a FormData
        const formData = new FormData(addBookForm)
        const addBookData = Object.fromEntries(formData.entries())
        //create book from data
        const newBook = Object.assign(new Book(), addBookData);

        const correctedBook = correctBookData(newBook);

        displayBook(correctedBook);
        togglePopup()
        myLibrary[correctedBook['title']] = correctedBook
    }
})

closePopUpButton.addEventListener('click', () => {togglePopup()})