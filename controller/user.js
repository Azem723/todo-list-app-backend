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
  username = decrypt(username);
  password = decrypt(password);
  const resusername = username;
  username = escape(username);

  const isNameAvailable = await isUserNameRepeatRes(username);

  if (isNameAvailable) {
    password = genPassword(password);
    password = escape(password);
    const newUid = genUid();
    const sql = `
    insert into user (uid,username,password)
    values (${newUid}, ${username}, ${password});
    `;

    const registData = await exec(sql);
    if (registData.affectedRows > 0) {
      return { success: true, uid: newUid, username: resusername };
    } else {
      return { success: false, message: '注册失败' };
    }
  } else {
    return { success: false, message: '用户名已被占用' };
  }
};

const changeUsername = async (oldUsername, newUsername, uid) => {
  oldUsername = decrypt(oldUsername);
  newUsername = decrypt(newUsername);
  const resname = newUsername;
  oldUsername = escape(oldUsername);
  newUsername = escape(newUsername);
  uid = escape(uid);
  // console.log(oldUsername, newUsername, uid);
  const isNameAvailable = await isUserNameRepeatRes(newUsername);
  if (isNameAvailable) {
    const sql = `
    update user set username=${newUsername} where uid=${uid};
    `;
    const changeNameRes = await exec(sql);
    if (changeNameRes.affectedRows > 0) {
      return {
        success: true,
        message: '用户名修改成功',
        newUsername: resname
      };
    } else {
      return { success: false, message: '用户名修改失败' };
    }
  } else {
    return { success: false, message: '用户名已被占用' };
  }
};

const changePasswordVerify = (oldPassword, uid) => {
  const sql = `
  select username from user where uid=${uid} and password=${oldPassword}
  `;
  return exec(sql).then((verifyRes) => {
    if (verifyRes.length > 0) {
      return true;
    } else {
      return false;
    }
  });
};
const changePassword = async (oldPassword, newPassword, uid) => {
  oldPassword = decrypt(oldPassword);
  newPassword = decrypt(newPassword);

  oldPassword = genPassword(oldPassword);
  newPassword = genPassword(newPassword);
  oldPassword = escape(oldPassword);
  newPassword = escape(newPassword);
  uid = escape(uid);
  const verifyRes = await changePasswordVerify(oldPassword, uid);
  if (verifyRes) {
    const sql = `
    update user set password=${newPassword} where uid=${uid}
    `;
    const changePassword = await exec(sql);
    if (changePassword.affectedRows > 0) {
      return { success: true, message: '密码修改成功，请重新登录' };
    } else {
      return { success: false, message: '密码修改失败' };
    }
  } else {
    return { success: false, message: '旧密码错误' };
  }
};

module.exports = {
  login,
  regist,
  changeUsername,
  changePassword
};
