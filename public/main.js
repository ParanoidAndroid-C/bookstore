const { stringify } = require("querystring");

function addBook(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("All good. ");
            window.location.href = "../booksForm";
        }
    }

    req.open("GET", "http://localhost:3000/booksForm");
    req.send();
}

let searchButton = document.getElementById("searchB")
searchButton.onclick = () => {
    let title = document.getElementById('bookTitle').value;
    let author = document.getElementById('bookAuthor').value;
    let genre = document.getElementById('bookGenre').value;
    let isbn = document.getElementById('bookISBN').value;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("All good. " + this.responseText);
            window.location.href = "/books?title=" + title + "&&author=" + author + "&&genre=" + genre + "&&isbn=" + isbn;
        }
    }

    req.open("GET", "http://localhost:3000/books?title=" + bookTitle + "&&author=" + author + "&&genre=" + genre + "&&isbn=" + isbn);
    req.send();

}

function removeBook(){
    let isbn = document.getElementById('isbn').value;
    let data = {isbn: isbn}
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("All good. " + this.responseText);
            window.location.href = "../main";
        }
    }

    req.open("PUT", "http://localhost:3000/main");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));

}

function reports(){

}

function publishers(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "../publisherForm";
        } 
    }

    req.open("GET", "http://localhost:3000/publisherForm");
    req.send();
}

let logout = document.getElementById("logout");
logout.onclick = () => {
    window.location.href = "../logout";
}