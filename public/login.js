function signIn() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const owner = document.getElementById("owner").checked;

    //console.log(owner);

    let user = { password, username, owner };

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "/books";
        } else if (this.readyState == 4 && this.status == 401) {
            location.reload();
            alert("Invalid username/password");
        }
    }

    req.open("POST", "http://localhost:3000/login");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(user));
}