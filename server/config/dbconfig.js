var mysql = require('mysql2');

var pool  = mysql.createPool({
  host            : 'localhost',
  user            : 'root',
  password        : 'Jzr2022offer',
  database        : 'AudioMailr',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;