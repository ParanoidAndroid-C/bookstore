-- set book_cnt to 15
create or replace function update_total_spent()
	returns trigger as $$
	begin
		update book
		set book_cnt = 15
		where book.book_id = new.book_id;
		return new;
	end;
	$$ LANGUAGE plpgsql;

-- refresing the publisher_profit view
create or replace function refresh_publisher_profit_view()
returns trigger as $$
begin
    refresh materialized view publisher_profit;
    return new;
end;
$$ LANGUAGE plpgsql;

-- refreshing the sales_publisher view
create or replace function refresh_sales_publisher_view()
returns trigger as $$
begin
    refresh materialized view sales_publisher;
    return new;
end;
$$ LANGUAGE plpgsql;