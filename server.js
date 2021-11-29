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
app.use("/books", booksRouter);
let checkoutRouter = require("./routers/checkout-router");
app.use("/checkout", checkoutRouter);
let authorsRouter = require("./routers/authors-router");
app.use("/authors", authorsRouter);

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

app.get("/logout", (req, res, next) => {
	if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = undefined;
		req.session.owner = false;
		let content = pug.renderFile("pages/login.pug");
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html");
		res.end(content);
	} else {
		res.status(404).send("You cannot log out because you aren't logged in.");
	}
});


const genres = ['sci-fi', 'romance', 'mystery', 'detecrive', 'classics', 'biography', 'history', 'horror']

// register
app.get("/register", (req, res, next)=> {
	let content = pug.renderFile("pages/register.pug", {genres: genres});
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html");
	res.end(content);
});

app.post("/register", db.register);

app.post("/cart", [auth, db.addToCart]);

app.put("/cart", [auth, db.removeFromCart])

app.get("/cart", [auth, db.getCart]);

app.get("/tracking/:oid", [auth, db.trackOrder]);

app.put("/main",[auth, db.removeBook]);
app.get("/main", [auth, db.getMain]);
app.get("/booksForm", [auth, db.getBookForm])
app.post("/booksForm", [auth, db.addBook])
app.post("/publisherForm", [auth, db.addPublisher])
app.get("/publisherForm", [auth, db.getPublisherForm])
app.get("/reports", [auth, db.getReports])
app.get("/customreports", [auth, db.getCustomReports])
app.post("/customreports", [auth, db.postCustomReports])
app.get("/recommendations", [auth, db.getRecommendations]);
 

function auth(req, res,next) {
	if (!req.session.loggedin) {
	  res.redirect("/login");
	  res.statusCode = 402;
	  res.end();
	} else {
	next();
	}
  }

// app.get("/cart", (req, res, next) => {
// 	let content = pug.renderFile("pages/cart.pug", {items: req.session.cart});
// 	res.statusCode = 200;
// 	res.setHeader("Content-Type", "text/html");
// 	res.end(content);
// })