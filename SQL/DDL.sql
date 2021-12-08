create table address
	(address_id	  SERIAL,
	street			varchar(30) NOT NULL,
	apt_num			varchar(50),
	city		varchar(20) NOT NULL,
	province		varchar(15),
	country			varchar(20) NOT NULL,
	zipcode			varchar(7),
	primary key (address_id)
	);

insert into address(street, apt_num, city, province, country, zipcode) values('wergo street', '15A', 'Pawnee', 'Indiana', 'USA', '123456');
insert into address(street, apt_num, city, province, country, zipcode) values('hddsa street', '1C', 'Somewi', 'Ontario', 'Canada', '123456');
insert into address(street, apt_num, city, province, country, zipcode) values('sawq street', '301D', 'Idon', 'Imereti', 'Canada', '1234');


create table "user"
	(user_id		SERIAL,
	name			varchar(30) NOT NULL,
	email			varchar(50) UNIQUE NOT NULL,
	password		varchar(40) NOT NULL,
	age		numeric(2) NOT NULL,
	genre		varchar(30),
	address_id		SERIAL,
	primary key (user_id),
	foreign key (address_id) references address
		on delete set null
	);

create table owner
	(owner_id		SERIAL,
	name			varchar(30),
	email			varchar(50),
	password		varchar(20),
	total_spent 	numeric(8,2),
	primary key (owner_id)
	);	

INSERT INTO owner(name, email, password, total_spent) values('Lomta', 'Lomta', 'a', 5000);

create table publisher
	(publisher_name			varchar(80),
	 address_id			SERIAL,
	 email			varchar(50),
	 banking_acc			varchar(50),
	 phone_number			varchar(10),
	 primary key (publisher_name),
	 foreign key (address_id) references address
		on delete set null
	);

COPY publisher
FROM 'C:\Users\Lomta\Desktop\3005\books_dataset\publisher.csv'
DELIMITER ','
CSV HEADER;

create table book
	(book_id		varchar(13),
	 title			varchar(120),
	average_rating		numeric(3,1),
	 language_code		varchar(30),
   	 page_cnt		numeric(4),
     price_org		numeric(6,2),
	rating_cnt		int,
	 release_date		date,
	 publisher_name	varchar(80),
	  price_store		numeric(6,2),
	  publisher_prcnt	numeric(2),
	  genre				varchar(30),
	  book_cnt			numeric(4),
	 primary key (book_id),
	 foreign key (publisher_name) references publisher 
	 		on delete set null	
	);    

COPY book
FROM 'C:\Users\Lomta\Desktop\3005\books_dataset\books.csv'
DELIMITER ','
CSV HEADER;

create table author
	(author_id		SERIAL,
	 name			varchar(30),
	 country		varchar(20),
	 primary key (author_id)
	);
SELECT setval('author_author_id_seq', max(author_id)) FROM author;

COPY author
FROM 'C:\Users\Lomta\Desktop\3005\books_dataset\author.csv'
DELIMITER ','
CSV HEADER;

create table book_author
	(book_id		varchar(13),
	 author_id			SERIAL, 
	 primary key (book_id, author_id),
	 foreign key (book_id) references book
		on delete cascade,
	 foreign key (author_id) references author
on delete set null
	);

COPY book_author
FROM 'C:\Users\Lomta\Desktop\3005\books_dataset\booksAuthor.csv'
DELIMITER ','
CSV HEADER;

create table orders
	(order_id		SERIAL, 
	 shipping_address	SERIAL,
	 billing_address	SERIAL,
	 order_date		date,
	 total		numeric(6,2),
	 tax_code varchar(5),
	 user_id	SERIAL,
	 primary key (order_id),
	foreign key (user_id) references "user"(user_id)
		on delete set null
	);

create table order_book
	(order_id		SERIAL, 
	 book_id		varchar(50),
	 primary key (order_id, book_id),
	 foreign key (order_id) references orders
		on delete set null,
	 foreign key (book_id) references book
		on delete set null		
	);

create table tracking
	(tracking_id		SERIAL,
	 updated_at     date,
	 location 		varchar(100),
	 country		varchar(20),
	 primary key (tracking_id),
	foreign key (tracking_id) references orders(order_id)
		on delete set null
	);

create materialized view sales_publisher(total_num, total_price, publisher_name) as
select count(*),sum(book.price_store), book.publisher_name 
FROM book, order_book, orders 
WHERE book.book_id = order_book.book_id 
AND orders.order_id = order_book.order_id
GROUP BY book.publisher_name;

create or replace function refresh_sales_publisher_view()
	returns trigger as $$
	begin
		refresh materialized view sales_publisher;
		return new;
	end;
	$$ LANGUAGE plpgsql;

create trigger publisher_sales
    AFTER INSERT OR UPDATE OR DELETE
    on order_book
    for each row
execute function refresh_sales_publisher_view();

create materialized view publisher_profit(total_num, profit, publisher_name) as
select count(*),round(sum(book.price_store*book.publisher_prcnt/100), 2), book.publisher_name 
FROM book, order_book, orders
WHERE book.book_id = order_book.book_id 
AND orders.order_id = order_book.order_id 
GROUP BY book.publisher_name; 

create or replace function refresh_publisher_profit_view()
	returns trigger as $$
	begin
		refresh materialized view publisher_profit;
		return new;
	end;
	$$ LANGUAGE plpgsql;

create trigger order_update
    AFTER INSERT OR UPDATE OR DELETE
    on order_book
    for each row
execute function refresh_publisher_profit_view();

create or replace function update_total_spent()
	returns trigger as $$
	begin
		update book
		set book_cnt = 15
		where book.book_id = new.book_id;
		return new;
	end;
	$$ LANGUAGE plpgsql;

create trigger update_total_spent
    AFTER UPDATE
    of book_cnt
	on book
    for each row
	when (old.book_cnt <= 10)
	execute function update_total_spent();
