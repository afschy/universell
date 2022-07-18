const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./router/indexRouter')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', router);

module.exports = app;