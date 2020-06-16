// following instructions from:
// https://www.sitepoint.com/using-node-mysql-javascript-client/

require('dotenv').config()
const mysql = require('mysql')

const con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  // database: process.env.MYSQL_DATABASE,
})

con.connect((err) => {
  if (err) {
    console.log('Error connecting to Db')
    return
  }
  console.log('Connection established')
})

con.end((err) => {
  // The connection is terminated gracefully
  // Ensures all remaining queries are executed
  // Then sends a quit packet to the MySQL server.
})
