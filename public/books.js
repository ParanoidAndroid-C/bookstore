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

function showBook(id) {
    console.log("ess")
	window.location.href = "/books/" + id;
}