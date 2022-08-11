const database = require('./database');

async function getCartPosts(user_id){
    const sql = `
    SELECT C.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, U.NAME AS USERNAME, PR.NAME AS PRODUCTNAME, C.QUANTITY AS QUANTITY, P.NEGOTIABLE AS NEGOTIABLE, C.TOTAL AS TOTAL, GET_FIRST_POST_IMAGE(C.POST_ID) AS IMG
    FROM CART C 
    JOIN POST P ON C.POST_ID = P.POST_ID
    JOIN USERS U ON U.USER_ID = P.POSTER_ID
    JOIN PRODUCT PR ON PR.PRODUCT_ID = P.PRODUCT_ID
    WHERE C.USER_ID = :u
    `;

    const binds = {u: user_id};
    return (await database.execute(sql,binds,database.options)).rows;
}

async function deleteFromCart(user_id, post_id){
    const sql = `
    DELETE
    FROM CART
    WHERE USER_ID = :u AND POST_ID = :p
    `;

    const binds = {u: user_id, p: post_id};
    return (await database.execute(sql,binds,database.options)).rows;
}

async function getTotalCartCost(user_id){
    const sql = `
    SELECT SUM(TOTAL) AS TOTALCOST
	FROM CART
	WHERE CART.USER_ID = :id
    `;

    const binds = {id: user_id};
    return (await database.execute(sql,binds,database.options)).rows;
}

async function validateCart(user_id, phone, address){
    const sql = `
    BEGIN
        VALIDATE_CART(:ID, :PHN, :ADDR);
    END;
    `;
    binds = {ID: user_id, PHN: phone, ADDR: address};
    await database.execute(sql,binds,database.options);
}

module.exports = {
    getCartPosts,
    deleteFromCart,
    getTotalCartCost,
    validateCart
}