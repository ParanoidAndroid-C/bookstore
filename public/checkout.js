function checkout() {
  // post checkout here
    let address;
    let addressCheck = document.getElementById("addressCheck")
    if (!addressCheck.checked) {
        const streetAddress = document.getElementById('address').value;
        const apt = document.getElementById('apt').value;
        const city = document.getElementById('city').value;
        const country = document.getElementById('country').value;
        const province = document.getElementById('province').value;
        const zipcode = document.getElementById('zipcode').value;
    
        // save these stuff including imageSrc in database
    
        address = {streetAddress, apt, city, country, province, zipcode};
    }

    
  }
  