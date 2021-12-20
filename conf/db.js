const env = process.env.NODE_ENV; // 环境变量

// 配置

let MYSQL_CONF;

if (env === 'dev') {
  // mysql
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '91735a',
    port: '3306',
    database: 'todolist-database'
  };
}

if (env === 'production') {
  // mysql
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'todolistDatabase'
  };
}

module.exports = {
  MYSQL_CONF
};
