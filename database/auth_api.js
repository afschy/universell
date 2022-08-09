const database = require('./database');

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

async function inputUser(password, name, email){
    const sql = `
        INSERT INTO Users(PASSWORD, NAME, EMAIL, CREATE_DATE, DP)
        VALUES(:p, :n, :e, SYSDATE, NULL)
    `;
    const binds = {p: password, n: name, e: email};
    await database.execute(sql, binds, database.options);
    
    let result = getInfoByEmail(email);
    if(result.length > 0) return true;
    else return false;
}

module.exports = {
    getInfoById,
    getInfoByEmail,
    inputUser
};