const { use } = require("../routers/books-router");

function isEmpty(str) {
  if(str == ""){
    return true;
  }
  return false;
}


// sign up button
// read email,username, password, etc.
function signUp() {
  const name = document.getElementById("nameR").value;
  const password = document.getElementById("passwordR").value;
  const email = document.getElementById("emailR").value;
  const age = document.getElementById("ageR").value;
  const genre = document.getElementById("genreR").value;
  const address = document.getElementById('address').value;
  const apt = document.getElementById('apt').value;
  const city = document.getElementById('city').value;
  const country = document.getElementById('country').value;
  const province = document.getElementById('province').value;
  const zipcode = document.getElementById('zipcode').value;

  // save these stuff including imageSrc in database

  let user= {name, password, email, age, genre, address, apt, city, country, province, zipcode};
 
  if (!isEmpty(name) && !isEmpty(password) && !isEmpty(password) && !isEmpty(address) && !isEmpty(city) && !isEmpty(country)) {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 201) {
        window.location.href = "/books";
      } else if (this.readyState == 4 && this.status == 400){
        alert("User with this email already exists");
        window.location.href = "/register";
      }
    } 

    console.log(user);

    req.open("POST", "http://localhost:3000/register");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(user));
  } else {
    alert("Please fill out all the fields : )");
    window.location.href = "/register";
  }
}



