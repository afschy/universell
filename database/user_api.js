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

module.exports = {
    getTopSellers,
    getStarSellers
}