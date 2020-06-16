// following instructions from:
// https://www.sitepoint.com/using-node-mysql-javascript-client/

require('dotenv').config()
const mysql = require('mysql')

// setup
const con = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'sitepoint',
})

// connect
con.connect((err) => {
  if (err) {
    console.log('Error connecting to Db')
    return
  }
  console.log('Connection established')
})

// make a query
con.query('SELECT * FROM authors', (err, rows) => {
  if (err) throw err

  console.log('Data received from Db:')
  console.log(rows)
})

// connection closed
con.end((err) => {
  // The connection is terminated gracefully
  // Ensures all remaining queries are executed
  // Then sends a quit packet to the MySQL server.
})
