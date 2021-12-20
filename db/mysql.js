const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

// 使用连接池重构 mysql 连接函数，防止连接自动断开
const con = mysql.createPool(MYSQL_CONF);

function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
        connection.release();
      }
    });
  });
  return promise;
}

// escape 函数预防 sql 注入攻击
module.exports = {
  exec,
  escape: mysql.escape
};
