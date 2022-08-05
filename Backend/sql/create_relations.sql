CREATE TABLE PostUpvote(
	user_id NUMBER NOT NULL,
	post_id NUMBER NOT NULL,
	
	CONSTRAINT postupvote_users_fk FOREIGN KEY(user_id) REFERENCES Users(user_id),
	CONSTRAINT postupvote_post_fk FOREIGN KEY(post_id) REFERENCES Post(post_id)
);

CREATE TABLE CmntUpvote(
	user_id NUMBER NOT NULL,
	cmnt_id NUMBER NOT NULL,
	
	CONSTRAINT cmntupvote_users_fk FOREIGN KEY(user_id) REFERENCES Users(user_id),
	CONSTRAINT cmntupvote_cmnt_fk FOREIGN KEY(cmnt_id) REFERENCES Cmnt(cmnt_id)
);

CREATE TABLE ReviewUpvote(
	user_id NUMBER NOT NULL,
	review_id NUMBER NOT NULL,
	
	CONSTRAINT reviewupvote_users_fk FOREIGN KEY(user_id) REFERENCES Users(user_id),
	CONSTRAINT reviewupvote_productreview_fk FOREIGN KEY(review_id) REFERENCES ProductReview(review_id)
);

CREATE TABLE ProductImage(
	product_id NUMBER NOT NULL,
	image VARCHAR(100) NOT NULL,
	CONSTRAINT productimage_product_fk FOREIGN KEY(product_id) REFERENCES Product(product_id)
);

CREATE TABLE PostImage(
	post_id NUMBER NOT NULL,
	image VARCHAR(100) NOT NULL,
	CONSTRAINT postimage_post_fk FOREIGN KEY(post_id) REFERENCES Post(post_id)
);

CREATE TABLE BelongsTo(
	product_id NUMBER NOT NULL,
	tag_id NUMBER NOT NULL,
	CONSTRAINT belongsto_product_fk FOREIGN KEY(product_id) REFERENCES Product(product_id),
	CONSTRAINT belongsto_tag_fk FOREIGN KEY(tag_id) REFERENCES Tag(tag_id)
);

CREATE TABLE Wishlist(
	user_id NUMBER NOT NULL,
	product_id NUMBER NOT NULL,
	CONSTRAINT wishlist_user_fk FOREIGN KEY(user_id) REFERENCES Users(user_id),
	CONSTRAINt wishlist_product_fk FOREIGN KEY(product_id) REFERENCES Product(product_id)
);

CREATE TABLE Cart(
	user_id NUMBER NOT NULL,
	post_id NUMBER NOT NULL,
	quantity NUMBER NOT NULL,
	total NUMBER NOT NULL,

	CONSTRAINT cart_user_fk FOREIGN KEY(user_id) REFERENCES Users(user_id),
	CONSTRAINT cart_post_fk FOREIGN KEY(post_id) REFERENCES Post(post_id)
);

CREATE TABLE Transaction(
	order_id NUMBER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1),
	user_id NUMBER NOT NULL,
	post_id NUMBER NOT NULL,
	time TIMESTAMP WITH LOCAL TIME ZONE,
	quantity NUMBER NOT NULL,
	status NUMBER NOT NULL,
	amount NUMBER NOT NULL,
	
	CONSTRAINT transaction_pk PRIMARY KEY(order_id),
	CONSTRAINT transaction_user_fk FOREIGN KEY(user_id) REFERENCES Users(user_id),
	CONSTRAINT transaction_post_fk FOREIGN KEY(post_id) REFERENCES Post(post_id),
	CONSTRAINT status_bound CHECK(status = 0 OR status = 1),
	CONSTRAINT amount_bound CHECK(amount >= 0)
);

CREATE TABLE Follow(
	user_id NUMBER NOT NULL,
	tag_id NUMBER NOT NULL,
	CONSTRAINT follow_user_fk FOREIGN KEY(user_id) REFERENCES Users(user_id),
	CONSTRAINT follow_tag_fk FOREIGN KEY(tag_id) REFERENCES Tag(tag_id)
);

