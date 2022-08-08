const database = require('./database');
const dateUtil = require('../utils/dateTime');

async function getInfoById(user_id){
    const sql = `
        SELECT user_id, password
        FROM Users
        WHERE user_id = :id
    `
    const binds = {id: user_id};
    console.log("in auth api function");
    return (await database.execute(sql,binds,database.options)).rows;
}

async function getInfoByEmail(email){
    const sql = `
        SELECT user_id, password
        FROM Users
        WHERE email = :e
    `;

    const binds = {e: email};
    return (await database.execute(sql,binds,database.options)).rows;
}

async function inputUser(user_id, password, name, email, dp){
    const sql = `
        INSERT INTO Users
        VALUES(:u, :p, :n, :e, :c, :d)
    `
    let currDate = dateUtil.getOracleDate();
    const binds = {u: user_id, p: password, n: name, e: email, c: currDate, d: dp};
    await database.execute(sql, binds, database.options);
    
    let result = getInfoById(user_id);
    if(result.length > 0) return true;
    else return false;
}

module.exports = {
    getInfoById,
    getInfoByEmail,
    inputUser
};