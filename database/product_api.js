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
}

async function createNewProduct(name, manufacturer, description, market_price_min, market_price_max){
    const sql = `
    INSERT INTO PRODUCT(NAME, MANUFACTURER, DESCRIPTION, MARKET_PRICE_MIN, MARKET_PRICE_MAX)
    VALUES(:n, :m, :d, :m1, :m2)
    `;
    const binds = {n: name, m: manufacturer, d: description, m1: market_price_min, m2: market_price_max};
    await database.execute(sql, binds, database.options);
}

module.exports = {
    getMostReviewedProducts,
    getProductInfoByName,
    createNewProduct
}