const librarySection = document.querySelector('main')

//This array will contain all the books
let myLibrary = []

//object constructor for books
function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
}


//takes users input and stores a new book in myLibrary.
function addBookToLibrary(title, author, pages, read) {
   const newBook = new Book(title, author, pages, read) 
   myLibrary.push(newBook)
}

addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 310, true)
addBookToLibrary('Pedro Páramo', 'Juan Rulfo', 128, false)
addBookToLibrary('La Raza Cósmica', 'José Vasconcelos', 70, true)

//adds divs with book information to library section
function displayBooks(arr = myLibrary){
    myLibrary.forEach( (book) => {
        //create book element as div
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');
        Object.values(book).forEach( value => {
            //add each property value to book div
            const propertyElement = document.createElement('p');
            propertyElement.textContent = value.toString()
            bookDiv.appendChild(propertyElement)
        }
        )
        librarySection.appendChild(bookDiv)
    }
    );
}

displayBooks()