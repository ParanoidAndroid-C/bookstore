-- triggers a function that refreshes a view that stores sales per publisher
create trigger publisher_sales
AFTER INSERT on order_book
for each row
execute function refresh_sales_publisher_view();

-- triggers a function that refreshes a view that stores profit per publisher
create trigger order_update
AFTER INSERT on order_book
for each row
execute function refresh_publisher_profit_view();

-- triggers a function that orders new books and resets book_cnt to 15
create trigger update_total_spent
AFTER UPDATE of book_cnt on book
for each row
when (old.book_cnt <= 10)
execute function update_total_spent();