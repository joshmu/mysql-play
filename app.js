// following instructions from:
// https://www.sitepoint.com/using-node-mysql-javascript-client/

//////////////////////////////////
// IMPORTS
//////////////////////////////////
require('dotenv').config()
const mysql = require('mysql')

//////////////////////////////////
// SETUP
//////////////////////////////////
const con = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'sitepoint',
})

//////////////////////////////////
// CONNECT
//////////////////////////////////
con.connect((err) => {
  if (err) {
    console.log('Error connecting to Db')
    return
  }
  console.log('Connection established')
})

//////////////////////////////////
// QUERIES
//////////////////////////////////
// READING
con.query('SELECT * FROM authors', (err, rows) => {
  if (err) throw err

  console.log('Data received from Db:\n')

  rows.forEach((row) => console.log(`${row.name} lives in ${row.city}`))
})

//////////////////////////////////
// connection closed
//////////////////////////////////
con.end((err) => {
  // The connection is terminated gracefully
  // Ensures all remaining queries are executed
  // Then sends a quit packet to the MySQL server.
})
