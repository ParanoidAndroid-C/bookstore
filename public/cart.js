const e = require("express");
const { use } = require("../routers/books-router");

function showBook(id) {
	window.location.href = "/books/" + id;
}

function removeBook(id) {
    let req = new XMLHttpRequest();
    let book = {book_id: id}
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            console.log("All good. Book removed successfully");
            window.location.href = "../cart";
        } if (this.readyState == 4 && this.status == 401) {
            alert("woah, such an empty cart! let's add some books first!");
            window.location.href = "../books";
        } 
    }

    req.open("PUT", "http://localhost:3000/cart");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(book));
}

function checkout() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "../checkout";
        } 
    }

    req.open("GET", "http://localhost:3000/checkout");
    //req.setRequestHeader("Content-Type", "application/json");
    req.send();
}
