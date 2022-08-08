const database = require('./database');

async function getNewPosts(offset, limit){
    const sql = `
    SELECT P.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, P.PRICE AS PRICE, P.REM_QUANTITY AS REMAINING, P.TIME AS TIME, P.NEGOTIABLE AS NEGOTIABLE, U.USER_ID AS USER_ID, U.NAME AS USERNAME, PR.NAME AS PRODUCTNAME, GET_FIRST_POST_IMAGE(P.POST_ID) AS IMG
    FROM POST P
    JOIN PRODUCT PR ON P.PRODUCT_ID = PR.PRODUCT_ID
    JOIN USERS U ON P.POSTER_ID = U.USER_ID
    ORDER BY P.TIME ASC
    OFFSET :o ROWS
    FETCH FIRST :l ROWS ONLY
    `;

    const binds = {
        o: offset,
        l: limit
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getTopPosts(offset, limit){
    const sql = `
    SELECT P.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, P.PRICE AS PRICE, P.REM_QUANTITY AS REMAINING, P.TIME AS TIME, P.NEGOTIABLE AS NEGOTIABLE, U.USER_ID AS USER_ID, U.NAME AS USERNAME, PR.NAME AS PRODUCTNAME, GET_FIRST_POST_IMAGE(P.POST_ID) AS IMG, GET_UPVOTE_COUNT(POST_ID) AS UPVOTECOUNT
    FROM POST P
    JOIN PRODUCT PR ON P.PRODUCT_ID = PR.PRODUCT_ID
    JOIN USERS U ON P.POSTER_ID = U.USER_ID
    ORDER BY UPVOTECOUNT DESC
    OFFSET :o ROWS
    FETCH FIRST :l ROWS ONLY
    `;

    const binds = {
        o: offset,
        l: limit
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getMostReviewedPosts(offset, limit){
    const sql = `
    SELECT P.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, P.PRICE AS PRICE, P.REM_QUANTITY AS REMAINING, P.TIME AS TIME, P.NEGOTIABLE AS NEGOTIABLE, U.USER_ID AS USER_ID, U.NAME AS USERNAME, PR.NAME AS PRODUCTNAME, GET_FIRST_POST_IMAGE(P.POST_ID) AS IMG, GET_REVIEW_COUNT(P.POST_ID) AS REVIEWCOUNT
    FROM POST P
    JOIN PRODUCT PR ON P.PRODUCT_ID = PR.PRODUCT_ID
    JOIN USERS U ON P.POSTER_ID = U.USER_ID
    ORDER BY REVIEWCOUNT DESC
    OFFSET :o ROWS
    FETCH FIRST :l ROWS ONLY
    `;

    const binds = {
        o: offset,
        l: limit
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getWishlistPosts(user_id, offset, limit){
    const sql = `
    SELECT P.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, P.PRICE AS PRICE, P.REM_QUANTITY AS REMAINING, P.TIME AS TIME, P.NEGOTIABLE AS NEGOTIABLE, U.USER_ID AS USER_ID, U.NAME AS USERNAME, PR.NAME AS PRODUCTNAME, GET_FIRST_POST_IMAGE(P.POST_ID) AS IMG, GET_UPVOTE_COUNT(P.POST_ID) AS UPVOTECOUNT
    FROM POST P
    JOIN WISHLIST W ON P.PRODUCT_ID = W.PRODUCT_ID
    JOIN PRODUCT PR ON PR.PRODUCT_ID = P.PRODUCT_ID
    JOIN USERS U ON U.USER_ID = P.POSTER_ID
    WHERE W.USER_ID = :u
    ORDER BY UPVOTECOUNT DESC
    OFFSET :o ROWS
    FETCH FIRST :l ROWS ONLY
    `

    const binds = {
        u: user_id,
        o: offset,
        l: limit
    }
    return (await database.execute(sql, binds, database.options)).rows;
}

module.exports = {
    getNewPosts,
    getTopPosts,
    getWishlistPosts,
    getMostReviewedPosts
}