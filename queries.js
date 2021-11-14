const pug = require('pug');
const express = require('express');
const CryptoJS = require("crypto-js");
let key = "PLACEBO";
const Pool = require('pg').Pool;
const e = require('express');
const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '3005A',
        port: 5432,
 });

 function send404(res) {
    res.statusCode = 404;
    let content = pug.renderFile("error404.html");
    res.setHeader("Content-Type", "text/html");
    res.end(content);
  }
  

 const getBooks = (req, res) => {
    req.app.use("/public", express.static("./public"));
    req.app.use("/stylesheets", express.static("stylesheets"));
    pool.query('SELECT * FROM book WHERE average_rating > 4.0 LIMIT 20', (error, results) => {
      if (error) {
        throw error
      }
    
      //console.log(results.rows);
      let content = pug.renderFile("pages/books.pug", {books: results.rows});
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(content);

    })
  }

  const getBook = (req, res) => {
    req.app.use("/public", express.static("./public"));
    req.app.use("/stylesheets", express.static("stylesheets"));
    const id = parseInt(req.params.bid);

    pool.query(`SELECT * FROM book WHERE book_id = '${id}'`, (error, results) => {
      if (error) {
        throw error
      }
      
      const book = results.rows[0];
      pool.query(`SELECT * FROM book_author, author WHERE book_author.book_id = '${id}' AND book_author.author_id = author.author_id `, (err, resu) => {
        if (error) {
          throw error
        }
      
        //console.log(results.rows);
        //console.log(resu);
        let auth  = resu.rows;

        let content = pug.renderFile("pages/book.pug", {book: book, authors: auth});
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(content);
  
      })

    })
  }

  const addBook = (req, res) => {
   try {
    let body = "";
    req.on('data', (chunk) => {
      body += chunk;
    })
    req.on('end', () => {
        const newBook = JSON.parse(body);

        const title = newBook.title;
        const genre = newBook.genre;
        const author_id = newBook.author_id;
        const page_cnt = newBook.page_cnt;
        const price = newBook.price;
        const release_date = newBook.release_date;
        
        pool.query(`insert into books(title, genre, author_id, page_cnt, price, release_date) values(${title}, ${genre}, ${author_id}, ${page_cnt}, ${price}, ${release_date})`, (error, results) => {
        if (error) {
            throw error
        }
        
        // book added successfully
        console.log(results.rows);
       // let content = pug.renderFile("pages/book.pug", {book: results.rows});
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
       // res.end(content);

        })
     })
    } catch (err) {
        console.log(err);
        send404(res);
        return;
    }
}


const removeBook = (req, res) => {
    const id = parseInt(request.params.id);

    pool.query(`DELETE FROM books WHERE book_id = ${id}`, (error, results) => {
      if (error) {
        throw error
      }
    
      // render book removed successfully
    //   let content = pug.renderFile("pages/book.pug", {book: results.rows});
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
    //   res.end(content);

    })
  }
  
  const checkLogin = (req, res) => {
    req.app.use("/public", express.static("./public"));
    req.app.use("/stylesheets", express.static("stylesheets"));

    let email = req.body.email;
    let password = req.body.password;
    let owner = req.body.owner;
  
    // let cipher = CryptoJS.AES.encrypt(password, key);
    // password = cipher.toString();

    pool.query(`SELECT * FROM \"user\" WHERE email = '${email}' AND password = '${password}'`, (error, results) => {
      if (error) {
        throw error
      }
      
      if (results.rows.length == 1) {
        console.log(results.rows);
        res.statusCode = 200;
        res.end();
      } else {
        res.statusCode = 401;
        res.end();
      }
          
    })
  }

  const register = (req, res) => {
  
    const name = req.body.name;
    let password = req.body.password;
    // let cipher = CryptoJS.AES.encrypt(password, key);
    // password = cipher.toString();
    const email = req.body.email;
    const age = req.body.age;
    const genre = req.body.genre;
    const address = req.body.address;
    const apt = req.body.apt;
    const city = req.body.city;
    const country = req.body.country;
    const province = req.body.province;
    const zipcode = req.body.zipcode;

    pool.query(`insert into address(street, apt_num, city, province, country, zipcode) values('${address}', '${apt}', '${city}', '${province}', '${country}', '${zipcode}') RETURNING address_id`, (error, results) => {
      if (error) {
          throw error
      }

    const address_id = results.rows[0].address_id;
    //console.log(address_id);

    pool.query(`insert into \"user\"(name, email, password, age, genre, address_id) values('${name}', '${email}', '${password}', ${age}, '${genre}', ${address_id}) RETURNING user_id`, (err, resu) => {
      if (err) {
          res.statusCode = 400;
          res.end();
          //throw err
      } else {
      
          console.log(resu);
          res.statusCode = 201;
          res.end();
        }
    })
    })
  }


  const getAuthor = (req, res) => {
    req.app.use("/public", express.static("./public"));
    req.app.use("/stylesheets", express.static("stylesheets"));
    const id = parseInt(req.params.aid);

    pool.query(`SELECT * FROM author WHERE author_id = '${id}'`, (error, results) => {
      if (error) {
        throw error
      }
      
      const author = results.rows[0];
      pool.query(`SELECT * FROM book, book_author, author WHERE book_author.book_id = book.book_id  AND book_author.author_id = '${id}' AND book_author.author_id = author.author_id `, (err, resu) => {
        if (error) {
          throw error
        }
      
        //console.log(results.rows);
        //console.log(resu);

        let books  = resu.rows;
        //console.log(books);
    

        let content = pug.renderFile("pages/author.pug", {books: books, author: author});
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(content);
  
      })

    })
  }

  module.exports = {
      getBooks,
      getBook,
      addBook,
      removeBook,
      checkLogin,
      register,
      getAuthor
  }