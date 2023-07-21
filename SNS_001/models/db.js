const pgp = require('pg-promise')();

var connection = {
    host: 'localhost',
    port: 5432,
    database: 'SNS',
    user: 'postgres',
    password: 'Sosuimomo0131'
};
 
var db = pgp(connection);

db.connect()
    .then(obj => {
        console.log('データベースに接続しました');
        obj.done(); // 接続を解放します
    })
    .catch(error => {
        console.error('データベース接続エラー:', error.message || error);
    });

module.exports = db;