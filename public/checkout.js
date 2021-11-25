function checkout() {
  // post checkout here
    let checked = true;
    let address = {checked};
    let addressCheck = document.getElementById("addressCheck")
    if (!addressCheck.checked) {
        const streetAddress = document.getElementById('address').value;
        const apt = document.getElementById('apt').value;
        const city = document.getElementById('city').value;
        const country = document.getElementById('country').value;
        const province = document.getElementById('province').value;
        const zipcode = document.getElementById('zipcode').value;
        checked = false;
    
        address = {streetAddress, apt, city, country, province, zipcode, checked};
    }

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            window.location.href = "/books";
        } 
    }

    req.open("POST", "http://localhost:3000/checkout");
    req.setRequestHeader("Content-Type", "application/json");
    console.log(address)
    req.send(JSON.stringify(address));

  }
  