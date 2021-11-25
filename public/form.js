function submit(){
    const ISBN = document.getElementById("ISBN").value; 
    const title = document.getElementById("title").value;
    const page_cnt = document.getElementById("pagecnt").value;
    const price = document.getElementById("price").value; 
    const release_date = document.getElementById("date").value; 
    const language = document.getElementById("lang").value; 
    const publsiher = document.getElementById("publisher").value;
    let authors = document.getElementById("authors").value;

    authors = authors.split(", ");

    const book = {ISBN:ISBN, title:title, page_cnt:page_cnt, price:price, release_date:release_date, language:language, publsiher:publsiher, authors: authors}

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            console.log("All good. ");
            window.location.href = "../main";
        } else  if (this.readyState == 4 && this.status == 400){
            location.reload();
            alert("Please enter all the data correctly :' (");
        }  if (this.readyState == 4 && this.status == 401){
            location.reload();
            alert("Can't add author");
        }
    }

    req.open("POST", "http://localhost:3000/booksForm");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(book));
}
