const pug = require('pug');
const express = require('express');

const Pool = require('pg').Pool;


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
    let loggedin = req.session.loggedin;

    pool.query('SELECT * FROM book WHERE average_rating > 4.0 LIMIT 20', (error, results) => {
      if (error) {
        throw error
      }
    

      //console.log(results.rows);
      let content = pug.renderFile("pages/books.pug", {books: results.rows, loggedin: loggedin});
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(content);

    })
  }

  const getMain = (req, res) => {
    let content = pug.renderFile("pages/main.pug");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(content);
  }

  
  const getBookForm = (req, res) => {
    let content = pug.renderFile("pages/bookForm.pug");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(content);
  }


  const getBook = (req, res) => {
    req.app.use("/public", express.static("./public"));
    req.app.use("/stylesheets", express.static("stylesheets"));
    const id = req.params.bid;

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
console.log(book)
        let content = pug.renderFile("pages/book.pug", {book: book, authors: auth});
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(content);
  
      })

    })
  }

  const addBook = (req, res) => {

        const title = req.body.title;
        const page_cnt = parseInt(req.body.page_cnt);
        const price = parseFloat(req.body.price);
        const release_date = req.body.release_date;
        const ISBN = req.body.ISBN;
        const language = req.body.language;
        const publsiher = req.body.publsiher;
        let authors = req.body.authors;
        let namesList;
          namesList = "(";
          // build list
          for (let i = 0; i < authors.length; i++) {
            namesList += "'" + authors[i] + "'";
            if (i != authors.length -1) {
              namesList += ","
            }
          }
    
          namesList += ")";
          console.log(namesList);
        
        pool.query(`insert into book(book_id, title, language_code, page_cnt, price, release_date, publisher_name) values('${ISBN}', '${title}', '${language}', ${page_cnt}, ${price}, '${release_date}', '${publsiher}')`, (error, results) => {
        if (error) {
            res.statusCode = 400;
            throw error
        }

        pool.query(`SELECT * FROM author WHERE author.name IN ${namesList} `, (err, resu) => {
          if (err) {
              res.statusCode = 400;
              throw error
          
            }

            for (let i = 0; i < resu.rows.length; i++) {
              pool.query(`insert into book_author(book_id, author_id) values(${ISBN}, ${resu.rows[i].author_id} )`, (err, r) => {
                if (err) {
                    res.statusCode = 401;
                    throw err
                  }
                })
            }

              // book added successfully
              console.log(results.rows);
              let content = pug.renderFile("pages/main.pug");
              res.statusCode = 201;
              res.setHeader("Content-Type", "text/html");
              res.end(content);

        })
        
        })
        
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
    let tablename = "\"user\"";

    if (owner) {
      tablename = "owner";
    } 


    pool.query(`SELECT * FROM ${tablename} WHERE email = '${email}' AND password = '${password}'`, (error, results) => {
      if (error) {
        throw error
      }
      
      if (results.rows.length == 1) {
        console.log(req.session)
          req.session.loggedin = true;
          req.session.username = results.rows[0].name;
          req.session.cart = [];
          req.session.owner = true;
          req.session.userID = results.rows[0].user_id;
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
          req.session.loggedin = true;
          req.session.userID = resu.rows[0].user_id;
          req.session.username = name;
          req.session.cart = [];
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

        let books  = resu.rows;

        let content = pug.renderFile("pages/author.pug", {books: books, author: author});
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(content);
  
      })

    })
  }


  const addToCart = (req, res) => {
    let book_id = req.body.book_id;
    req.session.cart.push(book_id);
    console.log("added successfuly");
    res.statusCode = 201;
    res.end();
  }
  

  const getCart = (req, res) => {
    req.app.use("/public", express.static("./public"));
    req.app.use("/stylesheets", express.static("stylesheets"));
    let cart = req.session.cart;
    console.log(cart);

    if (cart.length > 0) {
      let idList = "(";
      // build list
      for (let i = 0; i < cart.length; i++) {
        idList += "'" + cart[i] + "'";
        if (i != cart.length -1) {
          idList += ","
        }
      }

      idList += ")";
      console.log(idList);

      pool.query(`SELECT * FROM book WHERE book_id IN ${idList}`, (error, results) => {
        if (error) {
          throw error
        }

        console.log(results.rows);
        let books = results.rows;
        let total = 0;

        for (let i = 0; i < books.length; i++) {
          total += parseInt(books[i].price);
        } 
  
        let content = pug.renderFile("pages/cart.pug", {books: books, total: total});
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(content);
      })
    } else {
      res.statusCode = 401;
      res.end();
    }
}

const removeFromCart = (req, res) => {
  let cart = req.session.cart;
  const book_id = req.body.book_id;
  const index = cart.indexOf(book_id);
  if (index > -1) {
    cart.splice(index, 1);
  }

  req.session.cart = cart;
  if (cart.length > 0) {
    let idList = "(";
    // build list
    for (let i = 0; i < cart.length; i++) {
      idList += "'" + cart[i] + "'";
      if (i != cart.length -1) {
        idList += ","
      }
    }

    idList += ")";
    console.log(idList);

    pool.query(`SELECT * FROM book WHERE book_id IN ${idList}`, (error, results) => {
      if (error) {
        throw error
      }

      console.log(results.rows);
      let books = results.rows;
    
      let content = pug.renderFile("pages/cart.pug", {books: books});
      res.statusCode = 201;
      res.setHeader("Content-Type", "text/html");
      res.end(content);
    })
  } else {
    res.statusCode = 401;
    res.end();
  }
}


const getCheckout = (req, res) => {
  req.app.use("/public", express.static("./public"));
  req.app.use("/stylesheets", express.static("stylesheets"));

    const userID = parseInt(req.session.userID);
    console.log(userID);

    pool.query(`SELECT * FROM "user", address WHERE user_id = ${userID} AND address.address_id = "user".address_id`, (error, results) => {
      if (error) {
        throw error
      }

      console.log(results.rows);
      let user = results.rows[0];

      console.log(user);

      let content = pug.renderFile("pages/checkout.pug", {user : user});
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(content);
    })
}


const postCheckout = (req, res) => {
  req.app.use("/public", express.static("./public"));
  req.app.use("/stylesheets", express.static("stylesheets"));

  let checked = req.body.checked;
  if (!checked) {
    // create new address
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
  
      pool.query(`insert into orders() values() RETURNING user_id`, (err, resu) => {
        if (err) {
            throw err
        } else {
          let content = pug.renderFile("pages/checkout.pug", {user : user});
          res.statusCode = 201;
          res.setHeader("Content-Type", "text/html");
          res.end(content);

        }
        })
    })
  } else {
    // get user address id
    // add to orders table
}
}

  module.exports = {
      getBooks,
      getBook,
      addBook,
      removeBook,
      checkLogin,
      register,
      getAuthor,
      getCart,
      removeFromCart,
      addToCart,
      getCheckout,
      postCheckout,
      getMain,
      getBookForm
  }