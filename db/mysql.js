const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONF);

// 开始连接
con.connect();

// 统一执行 sql 函数
function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
  return promise;
}

// escape 函数预防 sql 注入攻击
module.exports = {
  exec,
  escape: mysql.escape
};
