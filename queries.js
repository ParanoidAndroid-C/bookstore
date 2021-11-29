const pug = require('pug');
const express = require('express');

const Pool = require('pg').Pool;

const genres = ['sci-fi', 'romance', 'mystery', 'detecrive', 'classics', 'biography', 'history', 'horror']

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
  console.log(req.query)
    if (req.query.title || req.query.author || req.query.genre || req.query.isbn){
      let title = req.query.title == '' ? "UNDEFINED" : req.query.title;
      let genre = req.query.genre == '' ? "UNDEFINED" : req.query.genre;
      let author = req.query.author == '' ? "UNDEFINED" : req.query.author;
      let isbn = req.query.isbn == '' ? "UNDEFINED" : req.query.isbn;
      console.log(title)
      console.log(author)
      console.log(isbn)
      console.log(genre)
      pool.query(`SELECT DISTINCT(book_id, title) FROM book natural join book_author, author WHERE LOWER(title) LIKE LOWER('%${title}%') OR LOWER(author.name) LIKE LOWER('%${author}%') OR LOWER(genre) = LOWER('${genre}') OR book_id = '${isbn}' LIMIT 20`, (error, results) => {        if (error) {
          throw error
        }
        
        for (let i = 0; i < results.rows.length; i++) {
          let info = results.rows[i].row;
          info = info.substring(1, info.length - 1);
          info = info.split(",");
          results.rows[i] = {book_id: info[0], title : info[1]}
        }
        console.log(results.rows)
        //console.log(results.rows);
        let content = pug.renderFile("pages/books.pug", { books: results.rows, loggedin: loggedin });
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(content);
      })
    }else{

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
  }



  const getMain = (req, res) => {
    let content = pug.renderFile("pages/main.pug");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(content);
  }

  
  const getBookForm = (req, res) => {
    pool.query(`SELECT * FROM publisher`, (error, results) => {
      if (error) {
        throw error
      }
      
      let content = pug.renderFile("pages/bookForm.pug", {publishers: results.rows, genres: genres});
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(content);
    })
  }

  const getPublisherForm = (req, res) => {
    let content = pug.renderFile("pages/publisherForm.pug");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(content);
  }


  const getCustomReports = (req, res) => {
    let content = pug.renderFile("pages/customreports.pug", {results: []});
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(content);
  }
 
  const postCustomReports = (req, res) => {
    const query = req.body.query;
    console.log(query);

    pool.query(`${query}`, (error, results) => {
      if (error) {
        res.statusCode = 401;
        res.end();
       // throw error
      }

      if (results != undefined) {
          
      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(results.rows));
      }
      else {
        res.statusCode = 401;
        res.end();
      }
    })
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
        let content = pug.renderFile("pages/book.pug", {book: book, authors: auth});
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(content);
  
      })

    })
  }

  const addPublisher = (req, res) => {
    const name = req.body.name;
    const address = req.body.address;
    const apt = req.body.apt;
    const city = req.body.city;
    const country = req.body.country;
    const province = req.body.province;
    const zipcode = req.body.zipcode;
    const email = req.body.email;
    const banking_acc = req.body.banking_acc;
    const phone_number = req.body.phone_number;

    pool.query(`insert into address(street, apt_num, city, province, country, zipcode) values('${address}', '${apt}', '${city}', '${province}', '${country}', '${zipcode}') RETURNING address_id`, (error, results) => {
      if (error) {
          throw error
      }
      
      let address_id = results.rows[0].address_id;

      pool.query(`insert into publisher(publisher_name, address_id, email, banking_acc, phone_number) values('${name}', '${address_id}', '${email}', '${banking_acc}', '${phone_number}')`, (error, result) => {
        if (error) {
          throw error
        }
        let content = pug.renderFile("pages/main.pug");
        res.statusCode = 201;
        res.setHeader("Content-Type", "text/html");
        res.end(content);
      })

    })

  }

  const addBook = (req, res) => {

        const title = req.body.title;
        const page_cnt = parseInt(req.body.page_cnt);
        const price_store = parseFloat(req.body.price_store);
        const release_date = req.body.release_date;
        const ISBN = req.body.ISBN;
        const language = req.body.language;
        const publsiher = req.body.publsiher;
        const genre = req.body.genre;
        const price_org = parseFloat(req.body.price_org);
        const book_cnt = parseInt(req.body.book_cnt);
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

        pool.query(`insert into book(book_id, title, language_code, page_cnt, price_store, release_date, publisher_name, price_org, genre, book_cnt) values('${ISBN}', '${title}', '${language}', ${page_cnt}, ${price_store}, '${release_date}', '${publsiher}', ${price_org}, '${genre}', '${book_cnt}')`, (error, results) => {
        if (error) {
            res.statusCode = 400;
            throw error
        }

        pool.query(`SELECT * FROM author WHERE author.name IN ${namesList} `, (err, resu) => {
          if (err) {
              res.statusCode = 400;
              throw error
          
            }
            
            let names = []

            for (let i = 0; i  < resu.rows.length; i++) {
              names.push(resu.rows[i].name);
            }

            for (let i = 0; i < authors.length; i++) {
              if (!names.includes(authors[i])) {
                addAuthor(authors[i], ISBN);
              }
    
            }

            for (let i = 0; i < resu.rows.length; i++) {
              pool.query(`insert into book_author(book_id, author_id) values('${ISBN}', ${resu.rows[i].author_id} )`, (err, r) => {
                if (err) {
                    res.statusCode = 401;
                    throw err
                  }
                })
            }

             let total_spent = price_org * book_cnt;

              // book added successfully
              console.log(results.rows);
              updateTotalSpent(total_spent);
              let content = pug.renderFile("pages/main.pug");
              res.statusCode = 201;
              res.setHeader("Content-Type", "text/html");
              res.end(content);
        })  
      })       
}

function addAuthor(author, book_id) {
    pool.query(`insert into author(name) values('${author}') RETURNING author_id`, (errors, resu) => {
      if (errors) {
          throw errors
      }
      const author_id = resu.rows[0].author_id;

    pool.query(`insert into book_author(book_id, author_id) values('${book_id}', ${author_id})`, (err, re) => {
        if (err) {
            throw err
        }
        })
      })
}

function updateTotalSpent(total_spent) {
  pool.query(`update owner set total_spent = total_spent + ${total_spent}`, (errors, resu) => {
    if (errors) {
        throw errors
    }

    })
}


const removeBook = (req, res) => {
  let isbn = req.body.isbn;

  pool.query(`DELETE FROM book WHERE book_id = '${isbn}'`, (error, results) => {
    if (error) {
      throw error
    }
  
    // render book removed successfully
    let content = pug.renderFile("pages/main.pug");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(content);

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
          req.session.total = 0;
          req.session.userID = results.rows[0].user_id;
          req.session.address_id = results.rows[0].address_id;
          req.session.genre = results.rows[0].genre;
          req.session.age = results.rows[0].age;
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
          req.session.address_id = address_id;
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
          total += parseFloat(books[i].price_store);
        } 
  
        req.session.total = total;
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

  const billing_address = req.session.address_id;
  let address_id = billing_address;
  const today = new Date().toISOString().slice(0, 10);
  let taxCode = "ON"
  const total = req.session.total;
  const user_id = req.session.userID;

  let checked = req.body.checked;
  // get user address id
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
      
      address_id = results.rows[0].address_id;
  
      pool.query(`insert into orders(shipping_address, billing_address, order_date, total, tax_code, user_id) values(${address_id}, ${billing_address}, '${today}', ${total}, '${taxCode}', ${user_id}) RETURNING order_id`, (err, resu) => {
        if (err) {
            throw err
        } else {
          updateOrderBooksTable(resu.rows[0].order_id, req.session.cart)
          updateTracking(resu.rows[0].order_id)
          req.session.cart = [];
          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");
          const order_id = resu.rows[0].order_id;
          res.send(JSON.stringify(order_id));
          res.end();
        }
        })
    })
  } else {

    pool.query(`insert into orders(shipping_address, billing_address, order_date, total, tax_code, user_id) values(${address_id}, ${billing_address}, '${today}', ${total}, '${taxCode}', ${user_id}) RETURNING order_id`, (err, resu) => {
      if (err) {
          throw err
      } else {
        updateOrderBooksTable(resu.rows[0].order_id, req.session.cart)
        updateTracking(resu.rows[0].order_id)
        req.session.cart = [];
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        const order_id = resu.rows[0].order_id;
        res.send(JSON.stringify(order_id));
        res.end();
      }
      })
  }
}

const trackOrder = (req, res) => {
  const trackingID = parseInt(req.params.oid);
  const userID = parseInt(req.session.userID);
  console.log(userID);

  pool.query(`SELECT * FROM tracking, orders WHERE orders.user_id = ${userID} AND tracking_id = ${trackingID} AND orders.order_id = tracking.tracking_id`, (error, results) => {
    if (error) {
      res.statusCode = 401;
      res.end();
      //throw error
    } else {

    let tracking = results.rows[0];
    console.log(tracking);

    let content = pug.renderFile("pages/tracking.pug", {tracking : tracking});
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(content);
    }
  })
}


function updateOrderBooksTable (order_id, books){
  for (let i = 0; i < books.length; i++) {
    pool.query(`insert into order_book(order_id, book_id) values(${order_id}, '${books[i]}')`, (err, resu) => {
      if (err) {
          throw err
      }
      updateBookCnt(books[i]);
      })
  }
}

function updateTracking(order_id){
  const today = new Date().toISOString().slice(0, 10);
  const defaultLocation = "Ottawa, Ontario"
  
  pool.query(`insert into tracking(tracking_id, updated_at, location) values(${order_id}, '${today}', '${defaultLocation}')`, (err, resu) => {
    if (err) {
        throw err
    }
    })
}

function updateBookCnt(book_id) {
  pool.query(`update book set book_cnt = book_cnt - 1 RETURNING book_cnt`, (err, resu) => {
    if (err) {
        throw err
    }

    let book_cnt = parseInt(resu.rows[0].book_cnt)
    if (book_cnt < 10) {
      orderBooks(book_id);
    }
    })
}

function orderBooks(book_id) {
  pool.query(`update book set book_cnt = 15 RETURNING book_cnt, price_org`, (err, resu) => {
    if (err) {
        throw err
    }

    const book_price = parseFloat(resu.rows[0].price_org);

    pool.query(`update owner set total_spent = total_spent + 6 * ${book_price}`, (errors, resu) => {
      if (errors) {
          throw errors
      }
      })

    })
}

const getReports = (req, res) => {
  req.app.use("/public", express.static("./public"));
  req.app.use("/stylesheets", express.static("stylesheets"));

  pool.query(`SELECT count(*), sum(book.price_store), book.genre FROM book, order_book, orders
  WHERE book.book_id = order_book.book_id AND orders.order_id = order_book.order_id
  GROUP BY book.genre`, (error, sales_genre) => {
    if (error) {
      throw error
    }
    // console.log(sales_genre)
    pool.query(`
    select count(*), sum(price_store), author.name
    from author
    join book_author ON author.author_id = book_author.author_id
    join book ON book.book_id = book_author.book_id
    join order_book ON book.book_id = order_book.book_id
    GROUP BY author.name
    ORDER BY sum
    LIMIT 20`, (erro, sales_authror) => {
      if (erro) {
        throw erro
      }

      // console.log(sales_authror)
      pool.query(`SELECT count(*),sum(book.price_store), book.publisher_name FROM book, order_book, orders
      WHERE book.book_id = order_book.book_id AND orders.order_id = order_book.order_id
      GROUP BY book.publisher_name ORDER BY sum DESC LIMIT 20`, (err, sales_publisher) => {
        if (err) {
          throw err
        }

        pool.query(`SELECT count(*),round(sum(book.price_store*book.publisher_prcnt/100), 2), book.publisher_name FROM book, order_book, orders
        WHERE book.book_id = order_book.book_id AND orders.order_id = order_book.order_id
        GROUP BY book.publisher_name ORDER BY round DESC LIMIT 20`, (err2, publisher_profit) => {
          if (err2) {
            throw err2
          }

          pool.query(`SELECT sum(total) from orders`, (err3, total_income) => {
            if (err3) {
              throw err3
            } 
            pool.query(`SELECT total_spent - 5000 AS spent from owner`, (err4, total_spent) => {
              if (err4) {
                throw err4
              }  
          
            let content = pug.renderFile("pages/reports.pug", {sales_genre : sales_genre.rows, sales_author: sales_authror.rows, sales_publisher: sales_publisher.rows, profit_publisher: publisher_profit.rows, total_income: total_income.rows[0], total_spent: total_spent.rows[0]});
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(content);  
          })  
        })
        })
      })
    })
  
  })
}

const getRecommendations = (req, res) => {
  const genre = req.session.genre;
  const age = parseInt(req.session.age);
  
  pool.query(`select * from book
  where genre = '${genre}' and average_rating is not null
  order by average_rating desc
  limit 10`, (err, genre_top) => {
    if (err) {
      throw err
    }

    pool.query(`select count(*), book.book_id, book.title
    from book natural join order_book, orders, "user"
    WHERE book.book_id = order_book.book_id AND orders.order_id = order_book.order_id AND "user".user_id = orders.user_id AND "user".age >${age - 3} AND "user".age >${age + 3}
    group by book.book_id
    order by count desc
    limit 10`, (err, age_top) => {
      if (err) {
        throw err
      }

      let content = pug.renderFile("pages/recommendations.pug", {genre_top: genre_top.rows, age_top: age_top.rows, genre: genre});
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
      getAuthor,
      getCart,
      removeFromCart,
      addToCart,
      getCheckout,
      postCheckout,
      getMain,
     getBookForm,
      addPublisher,
      getPublisherForm,
      trackOrder,
      getReports,
      getCustomReports,
      postCustomReports,
      getRecommendations
  }