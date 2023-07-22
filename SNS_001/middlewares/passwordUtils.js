const bcrypt = require('bcrypt');
const saltRounds = 10; // ハッシュ化のコストパラメータ（推奨値は10）

async function hashPassword(password) {
  try {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error('Error hashing password:', err);
    throw err;
  }
}

module.exports = {
  hashPassword,
};
