var mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Leyan_2002',
  database: 'AudioMailr',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0
});

const connectToMySQL = async () => {
  try {
    await pool.getConnection();
    console.log('MySQL database connected!');
  } catch (err) {
    console.log('MySQL database connection error!', err);
    process.exit(1);
  }
};

connectToMySQL().then();

module.exports = pool;