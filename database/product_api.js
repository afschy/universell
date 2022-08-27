const database = require('./database');

async function getMostReviewedProducts(num){
    const sql = `
    SELECT P.PRODUCT_ID AS PID, P.NAME AS NAME, AVG(PR.NUM_STARS) AS STARS
    FROM PRODUCT P JOIN PRODUCTREVIEW PR ON P.PRODUCT_ID = PR.PRODUCT_ID
    GROUP BY P.PRODUCT_ID, P.NAME
    ORDER BY STARS DESC
    FETCH FIRST :n ROWS ONLY;
    `;

    const binds = {n: num};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getProductInfoByName(productName){
    const sql = `
    SELECT * FROM PRODUCT
    WHERE LOWER(NAME) = LOWER(:p)
    `;
    const binds = {p: productName};

    let result = (await database.execute(sql, binds, database.options)).rows;
    if(result.length > 0) return result[0];
    createNewProduct(productName, 'unspecified', null, null, null);
    return (await database.execute(sql, binds, database.options)).rows;
}

async function createNewProduct(name, manufacturer, description, market_price_min, market_price_max){
    const sql = `
    INSERT INTO PRODUCT(NAME, MANUFACTURER, DESCRIPTION, MARKET_PRICE_MIN, MARKET_PRICE_MAX)
    VALUES(:n, :m, :d, :m1, :m2)
    `;
    const binds = {n: name, m: manufacturer, d: description, m1: market_price_min, m2: market_price_max};
    await database.execute(sql, binds, database.options);
}

async function getAllProducts(user_id){
    const sql = 'SELECT PRODUCT_ID, NAME, MANUFACTURER, DESCRIPTION, MARKET_PRICE_MIN, MARKET_PRICE_MAX, HAS_WISHLISTED_PRODUCT(:u, PRODUCT_ID) AS HAS_WISHLISTED FROM PRODUCT';
    const binds = {u: user_id};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getAllTags(user_id){
    const sql = 'SELECT TAG_ID, NAME, HAS_FOLLOWED_TAG(:u, TAG_ID) AS HAS_FOLLOWED FROM TAG'
    const binds = {u: user_id};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function addToWishlist(user_id, product_id){
    const sql = 'INSERT INTO WISHLIST VALUES(:u, :p)';
    const binds = {u: user_id, p: product_id};
    await database.execute(sql, binds, database.options);
}

async function removeFromWishlist(user_id, product_id){
    const sql = 'DELETE FROM WISHLIST WHERE USER_ID = :u AND PRODUCT_ID = :p';
    const binds = {u: user_id, p: product_id};
    await database.execute(sql, binds, database.options);
}

async function addToFollow(user_id, tag_id){
    const sql = 'INSERT INTO FOLLOW VALUES(:u, :t)';
    const binds = {u: user_id, t: tag_id};
    await database.execute(sql, binds, database.options);
}

async function removeFromFollow(user_id, tag_id){
    const sql = 'DELETE FROM FOLLOW WHERE USER_ID = :u AND TAG_ID = :t';
    const binds = {u: user_id, t: tag_id};
    await database.execute(sql, binds, database.options);
}

module.exports = {
    getMostReviewedProducts,
    getProductInfoByName,
    createNewProduct,
    getAllProducts,
    getAllTags,
    addToWishlist,
    removeFromWishlist,
    addToFollow,
    removeFromFollow
}