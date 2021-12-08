-- search by given parameters
SELECT DISTINCT(book.book_id, title) FROM book
join book_author ON book.book_id = book_author.book_id
join author ON author.author_id = book_author.author_id
WHERE LOWER(title) LIKE LOWER('%${title}%') 
OR LOWER(author.name) LIKE LOWER('%${author}%')
OR LOWER(genre) = LOWER('${genre}') 
OR book.book_id = '${isbn}'
 
-- retrieve 20 books that has average_rating higher than 4.0
SELECT * FROM book WHERE average_rating > 4.0 LIMIT 20

-- retrive all the publisher
SELECT * FROM publisher

-- retrive a book with the given id
SELECT * FROM book WHERE book_id = '${id}'

-- query author and book_author info
SELECT * FROM book_author, author WHERE book_author.book_id = '${id}' AND book_author.author_id = author.author_id

-- insert a new address into the address table 
insert into address(street, apt_num, city, province, country, zipcode) values('${address}', '${apt}', '${city}', '${province}', '${country}', '${zipcode}') RETURNING address_id

-- insert a new publisher into the publisher table
insert into publisher(publisher_name, address_id, email, banking_acc, phone_number) values('${name}', '${address_id}', '${email}', '${banking_acc}', '${phone_number}')

-- insert a new book into the book table
insert into book(book_id, title, language_code, page_cnt, price_store, release_date, publisher_name, price_org, genre, book_cnt) values('${ISBN}', '${title}', '${language}', ${page_cnt}, ${price_store}, '${release_date}', '${publsiher}', ${price_org}, '${genre}', '${book_cnt}')

-- 
SELECT * FROM author WHERE author.name IN ${namesList}

-- insert a new data to the book_author table
insert into book_author(book_id, author_id) values('${ISBN}', ${resu.rows[i].author_id} )

-- insert a new author to the author table
insert into author(name) values('${author}') RETURNING author_id

-- insert a new data to the book_author table
insert into book_author(book_id, author_id) values('${book_id}', ${author_id})

-- update owner's total spent in the owner table
update owner set total_spent = total_spent + ${total_spent}

-- delete a book with the given isbn
DELETE FROM book WHERE book_id = '${isbn}'

-- for sign in, tablename could be either user or owner
SELECT * FROM ${tablename} WHERE email = '${email}' AND password = '${password}'

-- insert a new address to the adress table 
insert into address(street, apt_num, city, province, country, zipcode) values('${address}', '${apt}', '${city}', '${province}', '${country}', '${zipcode}') RETURNING address_id

-- insert a new user to the user table
insert into \"user\"(name, email, password, age, genre, address_id) values('${name}', '${email}', '${password}', ${age}, '${genre}', ${address_id}) RETURNING user_id

-- retrieve an author with the given id
SELECT * FROM author WHERE author_id = '${id}'

-- query book and book author information
SELECT * FROM book, book_author, author WHERE book_author.book_id = book.book_id  AND book_author.author_id = '${id}' AND book_author.author_id = author.author_id 

-- get a book with its id in the list
SELECT * FROM book WHERE book_id IN ${idList}

-- get user address id
SELECT * FROM "user", address WHERE user_id = ${userID} AND address.address_id = "user".address_id

-- create new address
insert into address(street, apt_num, city, province, country, zipcode) values('${address}', '${apt}', '${city}', '${province}', '${country}', '${zipcode}') RETURNING address_id

-- update orders table
insert into orders(shipping_address, billing_address, order_date, total, tax_code, user_id) values(${address_id}, ${billing_address}, '${today}', ${total}, '${taxCode}', ${user_id}) RETURNING order_id

-- query tracking info
SELECT * FROM tracking, orders WHERE orders.user_id = ${userID} AND tracking_id = ${trackingID} AND orders.order_id = tracking.tracking_id

-- insert a book / order row
insert into order_book(order_id, book_id) values(${order_id}, '${book}')
 
-- insert new tracking row
insert into tracking(tracking_id, updated_at, location) values(${order_id}, '${today}', '${defaultLocation}')

-- update book count after checkout
update book set book_cnt = book_cnt - 1 where book_id = '${book_id}' RETURNING book_cnt, price_org

-- update total spent for owner
update owner set total_spent = total_spent + 6 * ${book_price} where owner_id = ${owner_id}

-- sales per genre
SELECT count(*), sum(book.price_store), book.genre FROM book, order_book, orders
WHERE book.book_id = order_book.book_id AND orders.order_id = order_book.order_id
GROUP BY book.genre

-- sales per author top 20
select count(*), sum(price_store), author.name
from author
join book_author ON author.author_id = book_author.author_id
join book ON book.book_id = book_author.book_id
join order_book ON book.book_id = order_book.book_id
GROUP BY author.name
ORDER BY sum
LIMIT 20

-- query the sales_publisher view
SELECT * FROM sales_publisher LIMIT 20

-- query the publisher_profit view
SELECT * FROM publisher_profit LIMIT 20

-- orders sum total
SELECT sum(total) from orders

-- spent money minus the beginning value
SELECT total_spent - 5000 AS spent from owner

-- top rated books with the given genre
select * from book
where genre = '${genre}' and average_rating is not null
order by average_rating desc
limit 10

-- most sold books in the given age range
select count(*), book.book_id, book.title
from book natural join order_book, orders, "user"
WHERE book.book_id = order_book.book_id AND orders.order_id = order_book.order_id AND "user".user_id = orders.user_id AND "user".age >${age - 3} AND "user".age >${age + 3}
group by book.book_id
order by count desc
limit 10





















