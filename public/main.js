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

function searchBooks(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("All good. ");
            window.location.href = "../booksForm";
        }
    }

    req.open("GET", "http://localhost:3000/search");
    req.send();
}

function removeBook(){

}

function reports(){

}

function publishers(){

}