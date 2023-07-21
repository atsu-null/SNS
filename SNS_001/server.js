const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const db = require('./models/db');

var { Client } = require('pg');

app.use(express.json()); // JSONの解析のため
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencodedの解析のため
app.set("view engine", "ejs");

app.use('/', routes);

app.listen(3000, () => {
    console.log('サーバーがポート3000で起動しました。');
});