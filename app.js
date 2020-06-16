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
  multipleStatements: true, // required when using procedure call with an out parameter
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

// CREATING
// * commenting out so we don't keep creating more records
/*
const author = { name: 'Craig Buckler', city: 'Exmouth' }
con.query('INSERT INTO authors SET ?', author, (err, res) => {
  if (err) throw err
  console.log('Last insert ID:', res.insertId)
})
*/

// UPDATING
con.query(
  'UPDATE authors SET city = ? Where ID = ?',
  ['Leipzig', 3],
  (err, result) => {
    if (err) throw err
    console.log(`Changed ${result.changedRows} row(s)`)
  }
)

// DESTROY
con.query('DELETE FROM authors WHERE id = ?', [10], (err, result) => {
  if (err) throw err
  console.log(`Deleted ${result.affectedRows} row(s)`)
})
// * note: result.affectedRows can be used both for updates and deletes, however result.changedRows is only useful for update information

// USE STORED PROCEDURE
con.query('CALL sp_get_authors()', (err, rows) => {
  if (err) throw err
  console.log('Data received from Db using stored procedure:')
  console.log(rows)
  rows[0].forEach((row) => console.log(`${row.name} lives in ${row.city}`))
})

con.query('CALL sp_get_author_details(1)', (err, rows) => {
  if (err) throw err
  console.log('Data received from Db using stored procedure with arg:\n')
  console.log(rows[0])
})

con.query(
  "SET @author_id = 0; CALL sp_insert_author(@author_id, 'Craig Buckler', 'Exmouth'); SELECT @author_id",
  (err, rows) => {
    if (err) throw err
    console.log(
      'Data received from Db using stored procedure with arg and out parameter:\n'
    )
    console.log(rows)
  }
)

// ! always escape user provided data! this will prevent SQL Injection Attacks
const userSubmittedVariable = 3
con.query(
  `SELECT * FROM authors WHERE id = ${mysql.escape(userSubmittedVariable)}`,
  (err, rows) => {
    if (err) throw err
    console.log('prevent SQL Attacks by using escape method:')
    console.log(rows)
  }
)
// * another way to prevent is to use '?' placeholders
con.query(
  'SELECT * FROM authors WHERE id = ?',
  [userSubmittedVariable],
  (err, rows) => {
    if (err) throw err
    console.log(rows)
  }
)

//////////////////////////////////
// connection closed
//////////////////////////////////
con.end((err) => {
  // The connection is terminated gracefully
  // Ensures all remaining queries are executed
  // Then sends a quit packet to the MySQL server.
})

//////////////////////////////////
// ORM > Object Relational Mapping of the Database
//////////////////////////////////
const Sequelize = require('sequelize')
const sequelize = new Sequelize(
  'sitepoint',
  'root',
  process.env.MYSQL_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
  }
)

const Author = sequelize.define(
  'author',
  {
    name: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
)

Author.findAll().then((authors) =>
  console.log('All authors:', JSON.stringify(authors, null, 4))
)
