DROP TABLE USER_INFO;
CREATE TABLE USER_INFO(
    user_id NUMBER(15),
    name varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    create_date DATE NOT NULL,
    img_url varchar(100),
    PRIMARY KEY(user_id)
);

INSERT INTO USER_INFO VALUES(1905081,'afschy','farhan.shahriar.2015@gmail.com','06-JUL-22',NULL);