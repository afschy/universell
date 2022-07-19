CREATE TABLE Users(
	user_id NUMBER,
	password VARCHAR(20) NOT NULL,
	name VARCHAR(50) NOT NULL,
	email VARCHAR(70) NOT NULL UNIQUE,
	create_date DATE NOT NULL,
	dp varchar(100),
	CONSTRAINT users_pk PRIMARY KEY(user_id),
	CONSTRAINT email_format CHECK(email LIKE '%@%.%')
);

CREATE TABLE Message(
	msg_id NUMBER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1),
	sender_id NUMBER NOT NULL,
	receiver_id NUMBER NOT NULL,
	text varchar(200),
	image varchar(100),
	time TIMESTAMP WITH LOCAL TIME ZONE,
	CONSTRAINT message_pk PRIMARY KEY(msg_id),
	CONSTRAINT message_users_fk1 FOREIGN KEY(sender_id) REFERENCES Users(user_id),
	CONSTRAINT message_users_fk2 FOREIGN KEY(receiver_id) REFERENCES Users(user_id)
);

CREATE TABLE Product(
	product_id NUMBER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1),
	name VARCHAR(50) NOT NULL,
	manufacturer VARCHAR(50),
	description VARCHAR(500),
	market_price_min NUMBER,
	market_price_max NUMBER,
	CONSTRAINT product_pk PRIMARY KEY(product_id)
);

CREATE TABLE ProductReview(
	review_id NUMBER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1),
	user_id NUMBER,
	product_id NUMBER,
	text VARCHAR(500),
	image VARCHAR(100),
	num_stars NUMBER,
	
	CONSTRAINT productreview_pk PRIMARY KEY(review_id),
	CONSTRAINT productreview_users_fk FOREIGN KEY(user_id) REFERENCES Users(user_id),
	CONSTRAINT productreview_product_fk FOREIGN KEY(product_id) REFERENCES Product(product_id),
	CONSTRAINT numstars_range CHECK(num_stars >= 1 AND num_stars <= 5)
);

CREATE TABLE Tag(
	tag_id NUMBER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1),
	name VARCHAR(30),
	CONSTRAINT tag_pk PRIMARY KEY(tag_id)
);

CREATE TABLE Post(
	post_id NUMBER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1),
	description VARCHAR(500),
	price NUMBER NOT NULL,
	rem_quantity NUMBER NOT NULL,
	time TIMESTAMP WITH LOCAL TIME ZONE,
	negotiable NUMBER NOT NULL,
	poster_id NUMBER,
	product_id NUMBER,
	
	CONSTRAINT post_pk PRIMARY KEY(post_id),
	CONSTRAINT post_users_fk FOREIGN KEY(poster_id) REFERENCES Users(user_id),
	CONSTRAINT post_product_fk FOREIGN KEY(product_id) REFERENCES Product(product_id),
	CONSTRAINT price_bound CHECK(price >= 0),
	CONSTRAINT rem_quantity_bound CHECK(rem_quantity >= 0),
	CONSTRAINT negotiable_bound CHECK(negotiable = 0 OR negotiable = 1)
);

CREATE TABLE Cmnt(
	cmnt_id NUMBER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1),
	text VARCHAR(500),
	time TIMESTAMP WITH LOCAL TIME ZONE,
	image VARCHAR(100),
	writer_id NUMBER,
	post_id NUMBER,
	
	CONSTRAINT cmnt_pk PRIMARY KEY(cmnt_id),
	CONSTRAINT cmnt_users_fk FOREIGN KEY(writer_id) REFERENCES Users(user_id),
	CONSTRAINT cmnt_post_fk FOREIGN KEY(post_id) REFERENCES Post(post_id),
	constraint content_const CHECK(text IS NOT NULL OR image IS NOT NULL)
);