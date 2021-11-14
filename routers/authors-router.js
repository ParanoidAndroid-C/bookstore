const express = require('express');
let router = express.Router();

const pug = require('pug');
const db = require('../queries')

router.get("/:aid", db.getAuthor);

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


module.exports = router;