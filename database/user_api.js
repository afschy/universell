const database = require('./database');

async function getTopSellers(num){
    const sql = `
    SELECT U.USER_ID AS USER_ID, U.NAME AS USERNAME, COUNT(*) AS SOLDNUM
    FROM TRANSACTION T JOIN POST P ON T.POST_ID = P.POST_ID
    JOIN USERS U ON P.POSTER_ID = U.USER_ID
    GROUP BY U.USER_ID, U.NAME
    ORDER BY SOLDNUM DESC
    FETCH FIRST :n ROWS ONLY
    `;

    const binds = {n: num};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getStarSellers(num){
    const sql = `
    SELECT U.USER_ID AS USER_ID, U.NAME AS USERNAME, AVG(R.NUM_STARS) AS STARS
    FROM USERS U
    JOIN POST P ON U.USER_ID = P.POSTER_ID
    JOIN REVIEW R ON R.POST_ID = P.POST_ID
    GROUP BY U.USER_ID, U.NAME
    ORDER BY STARS DESC
    FETCH FIRST :n ROWS ONLY
    `;

    const binds = {n: num};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getPostsByID(poster_id){
    const sql = `
    SELECT P.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, P.PRICE AS PRICE, P.REM_QUANTITY AS REMAINING, P.TIME AS TIME, P.NEGOTIABLE AS NEGOTIABLE, U.USER_ID AS USER_ID, U.NAME AS USERNAME, PR.NAME AS PRODUCTNAME, GET_FIRST_POST_IMAGE(P.POST_ID) AS IMG, GET_UPVOTE_COUNT(POST_ID) AS UPVOTECOUNT
    FROM POST P
    JOIN PRODUCT PR ON P.PRODUCT_ID = PR.PRODUCT_ID
    JOIN USERS U ON P.POSTER_ID = U.USER_ID
    WHERE P.POSTER_ID = :p
    ORDER BY P.TIME DESC
    `;
    const binds = {p: poster_id};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getReviewsByID(user_id){
    const sql = `
    SELECT REVIEW_ID, R.USER_ID AS USER_ID, U.NAME AS USERNAME, POST_ID, TEXT, IMAGE, NUM_STARS, GET_UPVOTE_COUNT_REVIEW(REVIEW_ID) AS UPVOTECOUNT
    FROM REVIEW R
    JOIN USERS U ON U.USER_ID = R.USER_ID
    WHERE U.USER_ID = :u
    `;
    const binds = {u: user_id};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getAllSellTransactions(user_id){
    const sql = `
    SELECT ORDER_ID, T.USER_ID AS BUYER_ID, U.NAME AS BUYER_NAME, T.POST_ID AS POST_ID, T.TIME AS TIME, QUANTITY, STATUS, AMOUNT, PHONE, ADDRESS
    FROM TRANSACTION T
    JOIN POST P
    ON P.POST_ID = T.POST_ID
    JOIN USERS U
    ON T.USER_ID = U.USER_ID
    WHERE P.POSTER_ID = :u
    `;
    const binds = {u: user_id};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getAllBuyTransactions(user_id){
    const sql = 'SELECT * FROM TRANSACTION WHERE USER_ID = :u';
    const binds = {u: user_id};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function validateOrder(order_id){
    const sql = `
    UPDATE TRANSACTION
    SET STATUS = 1
    WHERE ORDER_ID = :o
    `;
    const binds = {o: order_id};
    await database.execute(sql, binds, database.options);
}

module.exports = {
    getTopSellers,
    getStarSellers,
    getPostsByID,
    getReviewsByID,
    getAllSellTransactions,
    getAllBuyTransactions,
    validateOrder
}