function signIn() {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const owner = document.getElementById("owner").checked;

    //console.log(owner);

    let user = { password, email, owner };

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "/books";
        } else if (this.readyState == 4 && this.status == 401) {
            location.reload();
            alert("Invalid email/password");
        } else if (this.readyState == 4 && this.status == 400) {
            location.reload();
            alert("User with this email already exists");
        }
    }

    req.open("POST", "http://localhost:3000/login");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(user));
}