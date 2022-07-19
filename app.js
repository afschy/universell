const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const database = require('./database/database');
const router = require('./router/indexRouter')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(express.static('public'));

app.use('/', router);

// app.get('/', async(req, res) =>{
//     console.log("in homepage");
//     const sql = "SELECT COUNT(*)+11 AS count FROM Users";
//     const binds = {};
//     let ans = (await database.execute(sql, binds, database.options)).rows;
//     console.log(ans[0].COUNT);
// });

module.exports = app;