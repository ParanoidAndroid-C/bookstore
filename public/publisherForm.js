function submit(){
    const name = document.getElementById('name').value;
    const streetAddress = document.getElementById('address').value;
    const apt = document.getElementById('apt').value;
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;
    const province = document.getElementById('province').value;
    const zipcode = document.getElementById('zipcode').value;
    const email = document.getElementById('email').value;
    const banking_acc = document.getElementById('banking_acc').value;
    const phone_number = document.getElementById('phone_number').value;

    let info = {name, apt, city, country, province, zipcode, email, banking_acc, phone_number};

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            console.log("All good. ");
            window.location.href = "../main";
        } else  if (this.readyState == 4 && this.status == 400){
            location.reload();
            alert("Please enter all the data correctly :' (");
        }
    }

    req.open("POST", "http://localhost:3000/publisherForm");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(info));
}