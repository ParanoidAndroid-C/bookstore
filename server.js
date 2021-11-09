const http = require('http');
const pug = require('pug');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const pg = require('pg');
const db = require('./queries');

app.use(session({
	secret: 'seafoodisoverrated', //change this later
	saveUninitialized: true
}));


app.set("view engine", "pug");
app.listen(3000);

app.use("/public", express.static("./public"));
app.use("/stylesheets", express.static("stylesheets"));
app.use(bodyParser.json());


//routers
let booksRouter = require("./routers/books-router");
app.use("/", booksRouter);
let checkoutRouter = require("./routers/checkout-router");
app.use("/checkout", checkoutRouter);

app.get("/", (req, res, next) => {
	res.redirect('/books');
});

// user login
app.get("/login", (req, res, next) => {
	let content = pug.renderFile("pages/login.pug");

	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html");
	res.end(content);
});

app.post("/login", db.checkLogin);	
/*
app.post("/login", (req, res, next) => {

    if (req.session.loggedin) {
		res.status(200).send("Already logged in");
		return;
	}

	let email = req.body.email;
	let password = req.body.password;
    let owner = req.body.owner;

	let cipher = CryptoJS.AES.encrypt(password, key);
	cipher = cipher.toString();
	// console.log(cipher);

	// let decipher = CryptoJS.AES.decrypt(cipher, key);
	// decipher = decipher.toString(CryptoJS.enc.Utf8);
	// console.log(decipher);

	let userExists = true;

	if (db.checkLogin(email, password))

    //check in the daatabase if we have a user with given credentials 
    // add code here
    // this is just a test version


    let result = {username: "mary", password:"whocares", ID: 1}

    if (userExists) {
        req.session.curUser = result;
        req.session[result.ID] = true;
        req.session.loggedin = true;
        req.session.username = username;
        let content = pug.renderFile("pages/books.pug", {user: result});
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(content);
    } else {
        console.log("user not found");
        res.status(401).send("User not found");
    }

});
*/

app.get("/logout", (req, res, next) => {
	if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = undefined;
		let content = pug.renderFile("pages/login.pug");
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html");
		res.end(content);
	} else {
		res.status(404).send("You cannot log out because you aren't logged in.");
	}
});

// register
app.get("/register", (req, res, next)=> {
	let content = pug.renderFile("pages/register.pug");
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html");
	res.end(content);
});

app.post("/register", db.register);
