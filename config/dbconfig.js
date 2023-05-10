// get the client
var mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
var pool  = mysql.createPool({
  host            : process.env.HOST,
  user            : process.env.USER,
  password        : process.env.PASSWORD,
  database        : process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0
});

// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

module.exports = promisePool;