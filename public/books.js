let cartButton = document.getElementById("cartB")
cartButton.onclick = () => {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("All good. ");
            window.location.href = "../cart";
        } else if (this.readyState == 4 && this.status == 401) {
            alert("woah, such an empty cart! let's add some books first!");
            window.location.href = "../books";
        }
    }

    req.open("GET", "http://localhost:3000/cart");
    req.send();
}

let searchButton = document.getElementById("searchB")
searchButton.onclick = () => {
    console.log("qqqqqwwwwwwwwww")
    let title = document.getElementById('bookTitle').value;
    let author = document.getElementById('bookAuthor').value;
    let genre = document.getElementById('bookGenre').value;
    let isbn = 0 //document.getElementById('bookISBN').value;
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


function showBook(id) {
    console.log("ess")
	window.location.href = "/books/" + id;
}

let logIn = document.getElementById("login");
logIn.onclick = () => {
    window.location.href = "../login";
}

let logout = document.getElementById("logout");
logout.onclick = () => {
    window.location.href = "../logout";
}