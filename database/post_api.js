const database = require('./database');

async function createNewPost(description, price, rem_quantity, negotiable, poster_id, product_id){
    const sql = `
    INSERT INTO POST(DESCRIPTION, PRICE, REM_QUANTITY, TIME, NEGOTIABLE, POSTER_ID, PRODUCT_ID)
    VALUES(:d, :p, :r, SYSDATE, :n, :po, :pr)
    `;
    const binds = {d: description, p: price, r: rem_quantity, n: negotiable, po: poster_id, pr: product_id};
    await database.execute(sql, binds, database.options);
}

async function getNewPosts(offset, limit){
    const sql = `
    SELECT P.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, P.PRICE AS PRICE, P.REM_QUANTITY AS REMAINING, P.TIME AS TIME, P.NEGOTIABLE AS NEGOTIABLE, U.USER_ID AS USER_ID, U.NAME AS USERNAME, PR.NAME AS PRODUCTNAME, GET_FIRST_POST_IMAGE(P.POST_ID) AS IMG, GET_UPVOTE_COUNT(POST_ID) AS UPVOTECOUNT
    FROM POST P
    JOIN PRODUCT PR ON P.PRODUCT_ID = PR.PRODUCT_ID
    JOIN USERS U ON P.POSTER_ID = U.USER_ID
    ORDER BY P.TIME DESC
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
    `;

    const binds = {
        u: user_id,
        o: offset,
        l: limit
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getFollowPosts(user_id, offset, limit){
    const sql = `
    SELECT DISTINCT P.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, P.PRICE AS PRICE, P.REM_QUANTITY AS REMAINING, P.TIME AS TIME, P.NEGOTIABLE AS NEGOTIABLE, U.USER_ID AS USER_ID, U.NAME AS USERNAME, PR.NAME AS PRODUCTNAME, GET_FIRST_POST_IMAGE(P.POST_ID) AS IMG, GET_UPVOTE_COUNT(P.POST_ID) AS UPVOTECOUNT
    FROM POST P
    JOIN PRODUCT PR ON PR.PRODUCT_ID = P.PRODUCT_ID
    JOIN BELONGSTO B ON B.PRODUCT_ID = PR.PRODUCT_ID
    JOIN TAG T ON T.TAG_ID = B.TAG_ID
    JOIN FOLLOW F ON F.TAG_ID = T.TAG_ID
    JOIN USERS U ON U.USER_ID = P.POSTER_ID
    WHERE F.USER_ID = :u
    ORDER BY UPVOTECOUNT DESC
    OFFSET :o ROWS
    FETCH FIRST :l ROWS ONLY
    `;

    const binds = {
        u: user_id,
        o: offset,
        l: limit
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getRemainingNum(post_id){
    const sql = `
    SELECT REM_QUANTITY AS REMAINING
    FROM POST
    WHERE POST_ID = :p
    `;
    const binds = {p: post_id};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getAllInfo(post_id){
    const sql = `
    SELECT P.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, P.NEGOTIABLE AS NEGOTIABLE, U.NAME AS SELLERNAME, P.PRICE AS PRICE, PR.NAME AS PRODUCTNAME,
    P.REM_QUANTITY AS REMAINING, P.TIME AS TIME, GET_UPVOTE_COUNT(P.POST_ID) AS UPVOTECOUNT
    FROM POST P
    JOIN PRODUCT PR ON P.PRODUCT_ID = PR.PRODUCT_ID
    JOIN USERS U ON U.USER_ID = P.POSTER_ID
    WHERE P.POST_ID = :p
    `;
    const binds = {p: post_id};
    let result = (await database.execute(sql, binds, database.options)).rows;
    return result[0];
}

async function getImages(post_id){
    const sql = `
    SELECT IMAGE FROM POSTIMAGE
    WHERE POST_ID = :p
    `;
    const binds = {p: post_id};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function hasUpvotedPost(user_id, post_id){
    const sql = `
    SELECT COUNT(*) AS COUNTER
    FROM POSTUPVOTE
    WHERE USER_ID = :u AND POST_ID = :p
    `;
    const binds = {u: user_id, p: post_id};
    
    let result = (await database.execute(sql, binds, database.options)).rows;
    return result[0].COUNTER;
}

async function addUpvote(user_id, post_id){
    const sql = `
    INSERT INTO POSTUPVOTE VALUES(:u, :p)
    `;
    const binds = {u: user_id, p: post_id};
    await database.execute(sql, binds, database.options);
}

async function removeUpvote(user_id, post_id){
    const sql = `
    DELETE FROM POSTUPVOTE
    WHERE USER_ID = :u AND POST_ID = :p
    `;
    const binds = {u: user_id, p: post_id};
    await database.execute(sql, binds, database.options);
}

async function deletePost(post_id){
    const sql = 'DELETE FROM POST WHERE POST_ID = :p';
    const binds = {p: post_id};
    await database.execute(sql, binds, database.options);
}

async function addPostImage(post_id, url){
    const sql = 'INSERT INTO POSTIMAGE VALUES(:p, :u)';
    const binds = {p: post_id, u: url};
    await database.execute(sql, binds, database.options);
}

async function searchForPost(text, sortBy, sortType){
    text = text.toLowerCase();
    let sql = `
    SELECT P.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, P.NEGOTIABLE AS NEGOTIABLE, U.NAME AS SELLERNAME, P.PRICE AS PRICE, PR.NAME AS PRODUCTNAME,
    P.REM_QUANTITY AS REMAINING, P.TIME AS TIME, GET_UPVOTE_COUNT(P.POST_ID) AS UPVOTECOUNT
    FROM POST P
    JOIN PRODUCT PR ON P.PRODUCT_ID = PR.PRODUCT_ID
    JOIN USERS U ON U.USER_ID = P.POSTER_ID
    WHERE LOWER(PR.NAME) LIKE ` + `'%` + text + `%'` + ` ORDER BY ` + sortBy + ` ` + sortType;

    let binds = {};
    let _productMatch = (await database.execute(sql, binds, database.options)).rows;

    sql = `
    SELECT P.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, P.NEGOTIABLE AS NEGOTIABLE, U.NAME AS SELLERNAME, P.PRICE AS PRICE, PR.NAME AS PRODUCTNAME,
    P.REM_QUANTITY AS REMAINING, P.TIME AS TIME, GET_UPVOTE_COUNT(P.POST_ID) AS UPVOTECOUNT
    FROM POST P
    JOIN PRODUCT PR ON P.PRODUCT_ID = PR.PRODUCT_ID
    JOIN USERS U ON U.USER_ID = P.POSTER_ID
    WHERE LOWER(P.DESCRIPTION) LIKE ` + `'%` + text + `%'` + ` ORDER BY ` + sortBy + ` ` + sortType;

    let _descriptionMatch = (await database.execute(sql, binds, database.options)).rows;

    sql = `
    SELECT DISTINCT P.POST_ID AS POST_ID, P.DESCRIPTION AS DESCRIPTION, P.PRICE AS PRICE, P.REM_QUANTITY AS REMAINING, P.TIME AS TIME, P.NEGOTIABLE AS NEGOTIABLE, U.USER_ID AS USER_ID, U.NAME AS USERNAME, PR.NAME AS PRODUCTNAME, GET_FIRST_POST_IMAGE(P.POST_ID) AS IMG, GET_UPVOTE_COUNT(P.POST_ID) AS UPVOTECOUNT
    FROM POST P
    JOIN PRODUCT PR ON PR.PRODUCT_ID = P.PRODUCT_ID
    JOIN BELONGSTO B ON B.PRODUCT_ID = PR.PRODUCT_ID
    JOIN TAG T ON T.TAG_ID = B.TAG_ID
    JOIN USERS U ON U.USER_ID = P.POSTER_ID
    WHERE LOWER(T.NAME) LIKE ` + `'%` + text + `%'` + ` ORDER BY ` + sortBy + ` ` + sortType;

    let _tagMatch = (await database.execute(sql, binds, database.options)).rows;

    let result = {
        productMatch: _productMatch,
        descriptionMatch: _descriptionMatch,
        tagMatch: _tagMatch
    };
    return result;
}

module.exports = {
    createNewPost,
    getNewPosts,
    getTopPosts,
    getWishlistPosts,
    getFollowPosts,
    getMostReviewedPosts,
    getRemainingNum,
    getAllInfo,
    getImages,
    hasUpvotedPost,
    addUpvote,
    removeUpvote,
    deletePost,
    addPostImage,
    searchForPost
}