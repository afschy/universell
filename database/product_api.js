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

module.exports = {
    getMostReviewedProducts
}