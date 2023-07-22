const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const path = require('path');
const db = require('../models/db');
const passwordUtils = require('../middlewares/passwordUtils');

// GET

router.get("/", (req, res) => {
    res.sendStatus(404);
});

router.get('/signup', (req, res) => {
    res.render("signup");
});

router.get('/signin', (req, res) => {
    res.render("signin");
});

router.get("/:id", (req, res) => {
    const userid = req.params.id;
    db.oneOrNone('SELECT * FROM users WHERE user_id = $1', [userid])
      .then(user => {
        if (user) {
            // ユーザーが見つかった場合
            res.render("user", {username: user.username, user_id: user.user_id, chat_id: user.chat_id});
        } else {
          // ユーザーが見つからなかった場合
          return res.status(404).send('404 Not Found');
        }
    })
      .catch(error => {
        // エラーハンドリング
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    });
});


// POST

router.post('/signin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // データベースからemailに対応するユーザー情報を検索するクエリ
    db.oneOrNone('SELECT * FROM users WHERE email = $1', [email])
    .then(user => {
        if (user) {
            // ユーザーが見つかった場合
            // ユーザーが入力したパスワードとデータベースから取得したハッシュ化されたパスワードを比較
            bcrypt.compare(password, user.password_hash, (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    // 認証エラーの処理
                    res.render('signin', { error: 'Authentication error' });
                } else if (result) {
                    // パスワードが一致した場合の処理（認証成功）
                    console.log('Authentication successful!');
                    return res.redirect(`/${user.user_id}`);
                    // ユーザーに対してアクセスを許可
                } else {
                    // パスワードが一致しない場合の処理（認証失敗）
                    console.log('Authentication failed. Invalid password.');
                    // ログインを拒否
                    res.render('signin', { error: 'Invalid credentials' });
                }
            });
            
        } else {
            // ユーザーが見つからなかった場合
            res.render('signin', { error: 'Invalid credentials' });
        }
    })
    .catch(error => {
        console.error('データベースクエリエラー:', error.message || error);
        res.status(500).send('データベースエラーが発生しました');
    });
});


router.post('/signup', (req, res) => {
    const user_id = req.body.user_id;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    console.log(user_id, username, email)

    passwordUtils.hashPassword(password)
    .then(hashedPassword => {
        console.log('Hashed password:', hashedPassword);
        db.none('INSERT INTO users(user_id, username, password_hash, email) VALUES($1, $2, $3, $4)', [user_id, username, hashedPassword, email])
        .then(() => {
            console.log('データが正常に挿入されました');
        })
        .catch(error => {
            console.error('データベースクエリエラー:', error.message || error);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

});

router.post("/send_massage", (req, res) => {
    const chat_id = req.body.chat_id;
    const send_user_id = req.body.send_user_id;
    const message_content = req.body.message_content;
    const created_at = new Date();
    db.none('INSERT INTO users(chat_id, send_user_id, message_content, created_at) VALUES($1, $2, $3, $4)', [chat_id, send_user_id, message_content, created_at])
        .then(() => {
            console.log('データが正常に挿入されました');
        })
        .catch(error => {
            console.error('データベースクエリエラー:', error.message || error);
    });

});


  

module.exports = router;