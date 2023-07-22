const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const db = require('./models/db');
const http = require('http').Server(app);
const io = require('socket.io')(http);

var { Client } = require('pg');

app.use(express.json()); // JSONの解析のため
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencodedの解析のため
app.set("view engine", "ejs");

app.use('/', routes);

// Socket.ioのコネクションイベント
io.on('connection', (socket) => {
  console.log('a user connected');

  // チャットメッセージの送信イベント
  socket.on('chat message', (data) => {
    console.log('message: ' + data);
    
    db.none('INSERT INTO users(chat_id, send_user_id, message_content, created_at) VALUES($1, $2, $3, $4)', [chat_id, send_user_id, message_content, created_at])
        .then(() => {
            console.log('データが正常に挿入されました');
        })
        .catch(error => {
            console.error('データベースクエリエラー:', error.message || error);
        });


    // クライアントに受信したメッセージを送信
    io.emit('chat message', data);
  });

  // 切断イベント
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.listen(3000, () => {
    console.log('サーバーがポート3000で起動しました。');
});

