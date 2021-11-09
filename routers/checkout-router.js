const express = require('express');
let router = express.Router();

const path = require('path');
const fs = require("fs");
const pug = require('pug');

//router.get("/", [auth, getCheckout]);
router.get("/", getCheckout);


function auth(req, res,next) {
  if (!req.session.loggedin) {
    res.redirect("/login");
  } else {
  next();
  }
}


function send404(res) {
  res.statusCode = 404;
  let content = pug.renderFile("error404.html");
  res.setHeader("Content-Type", "text/html");
  res.end(content);
}


function getCheckout(req, res) {
    req.app.use("/public", express.static("./public"));
    req.app.use("/stylesheets", express.static("stylesheets"));

    let content = pug.renderFile("pages/checkout.pug");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(content);
}


module.exports = router;