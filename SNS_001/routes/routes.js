const express = require("express");
const router = express.Router();
const path = require('path');
const db = require('../models/db');

router.get("/", (req, res) => {
    res.sendStatus(404);
});

router.get('/signup', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/signup.html'));
});

router.get('/signin', (req, res) => {
    res.render("signin", {text: "^_^"});
});
  
  // サインインの処理を行うエンドポイント
  router.post('/signin', (req, res) => {
    // サインインのロジックを実装する
    const username = req.body.username;
    const password = req.body.password;
  
    // データベースからユーザー情報を検索するクエリ
    db.oneOrNone('SELECT * FROM user_table WHERE user_id = $1 AND user_name = $2', [username, password])
    .then(user => {
        if (user) {
        // ユーザーが見つかった場合
        res.render('user', { user });
        } else {
        // ユーザーが見つからなかった場合
        res.render('signin', { error: 'Invalid credentials' });
        }
    })
    .catch(error => {
        console.error('データベースクエリエラー:', error.message || error);
        res.status(500).send('データベースエラーが発生しました');
    });
  
    // ログイン失敗時の処理
    // res.render('signin', { error: 'Invalid credentials' });
  });

router.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log('ユーザー名:', username);
    console.log('パスワード:', password);

    db.none('INSERT INTO user_table(user_id, user_name) VALUES($1, $2)', [username, password])
    .then(() => {
        console.log('データが正常に挿入されました');
    })
    .catch(error => {
        console.error('データベースクエリエラー:', error.message || error);
    });

    res.sendFile(path.resolve(__dirname, '../views/user.ejs'));
});

module.exports = router;