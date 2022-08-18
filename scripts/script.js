const root = document.querySelector('html')
const librarySection = document.querySelector('main')
const darkModeSwitch = document.querySelector('#dark-mode')

//This array will contain all the books
let myLibrary = []

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
    myLibrary.push(newBook)
}

addBookToArray('The Hobbit', 'J.R.R. Tolkien', 310, true)
addBookToArray('Pedro Páramo', 'Juan Rulfo', 128, false)
addBookToArray('La Raza Cósmica', 'José Vasconcelos', 70, true)
addBookToArray('Gödel, Escher, Bach', 'Douglas Hofstadter', 777, true)

//used to capitalize book properties
function capitalize(word) {
    return word.replace(/\w/, (letter) => letter.toUpperCase())
}

console.log(capitalize('asdfasdf'))
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
            //format booleans to no or yes
            if (typeof(text) != 'boolean') {
                tableData.innerText = text;
            } else {
                tableData.innerText = book[property] ? 'Yes' : 'No'
            }
            tableRow.appendChild(tableData)
            }
        }
        )
    }
    librarySection.appendChild(bookDiv)
}

//displays all books in list
function displayAllBooks(arr = myLibrary) {
    myLibrary.forEach((book) => {
        //create book element as div
        displayBook(book)
    }
    );
}
displayAllBooks()

//change to dark mode with button
darkModeSwitch.addEventListener('click', () => {
    root.classList.toggle("dark")
});