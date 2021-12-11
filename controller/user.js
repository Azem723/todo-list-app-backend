const { exec, escape } = require('../db/mysql');
const { genPassword } = require('../utils/cryp');
const { decrypt } = require('../utils/cryp');

const login = (username, password) => {
  // 对用户名密码进行解码
  username = decrypt(username);
  password = decrypt(password);

  // escape 函数 预防 sql 注入攻击
  // 原理 转译
  username = escape(username);
  // md5生成加密密码，数据库中不存储明文密码
  password = genPassword(password);
  password = escape(password);
  const sql = `
    select username, uid from user where username=${username} and password=${password}
  `;

  // console.log('sql:', sql);

  return exec(sql).then((rows) => {
    return rows[0] || {};
  });
};

// 生成新用户 uid
const genUid = () => {
  const randomNumber = Math.floor(Math.random() * 100000).toString();
  const timestamp = Date.now().toString().slice(-6);
  return randomNumber + timestamp;
};

// 工具函数：检测新用户用户名是否重复
const isUserNameRepeatRes = (username) => {
  const sql = `
  select * from user where username=${username}
  `;
  return exec(sql).then((repeatRes) => {
    // 用户名重复！
    if (repeatRes.length !== 0) {
      return false;
    } else {
      // 用户名可用
      return true;
    }
  });
};

const regist = async (username, password) => {
  username = escape(username);

  const isRepeat = await isUserNameRepeatRes(username);

  if (isRepeat) {
    password = genPassword(password);
    password = escape(password);
    const newUid = genUid();
    const sql = `
    insert into user (uid,username,password)
    values (${newUid}, ${username}, ${password});
    `;
    try {
      const registData = await exec(sql);
      if (registData.affectedRows > 0) {
        return { success: true, uid: newUid };
      } else {
        return { success: false, message: '注册失败' };
      }
    } catch (error) {
      return { success: false, message: '注册失败' };
    }
  } else {
    return { success: false, message: '用户名已被占用' };
  }
};

module.exports = {
  login,
  regist
};
