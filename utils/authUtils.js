const jwt = require('jsonwebtoken');
const db_auth = require('../database/auth_api');

async function loginUser(res, user_id){
    const payload = {id: user_id};
    let token = jwt.sign(payload, process.env.APP_SECRET);
    let options = {
        maxAge: 90000000, 
        httpOnly: true
    }
    res.cookie('sessionToken', token, options);
}

module.exports = loginUser;