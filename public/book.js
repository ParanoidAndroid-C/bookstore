function showBook(id) {
	window.location.href = "/books/" + id;
}

function showAuthor(id) {
	window.location.href = "/authors/" + id;
}

function addToCart(book_id){
  let req = new XMLHttpRequest();
  let book = {book_id: book_id}
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 201) {
      console.log("All good. " + this.responseText);
	  //document.getElementById('addToCart').setValue = 'ahaa';
    }
  }

  req.open("POST", "http://localhost:3000/cart");
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(book));
}
