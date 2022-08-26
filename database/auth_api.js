const database = require('./database');

async function getInfoById(user_id){
    const sql = `
        SELECT *
        FROM Users
        WHERE user_id = :id
    `
    const binds = {id: user_id};
    return (await database.execute(sql,binds,database.options)).rows;
}

async function getInfoByEmail(email){
    const sql = `
        SELECT *
        FROM Users
        WHERE email = :e
    `;

    const binds = {e: email};
    return (await database.execute(sql,binds,database.options)).rows;
}

async function inputUser(password, name, email){
    const sql = `
        INSERT INTO Users(PASSWORD, NAME, EMAIL, CREATE_DATE, DP)
        VALUES(:p, :n, :e, SYSDATE, NULL)
    `;
    const binds = {p: password, n: name, e: email};
    await database.execute(sql, binds, database.options);
}

module.exports = {
    getInfoById,
    getInfoByEmail,
    inputUser
};