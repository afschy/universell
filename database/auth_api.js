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

module.exports = {
    getInfoById
};