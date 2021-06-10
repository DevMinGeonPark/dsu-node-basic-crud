require("dotenv").config();
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const mysql = require('mysql');

// dotenv package를 통해 .env에 값을 저장하고 활용
const client = mysql.createConnection({
  host : process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PW,
  database: process.env.DB 
})

const app = express()

app.use(express.urlencoded({
  extended: false
}))

app.listen(8080, function () {
  console.log('Server is running at : http://127.0.0.1:8080')
})

app.get('/', function (req, res) {
  fs.readFile('index.ejs', 'utf8', function (err, data) {
    client.query('select * from Users', function (err, results) {
      if (err) {
        res.send(err)
      } else {
        res.send(ejs.render(data, {
          data: results
        }))
      }
    })
  })
})

app.get('/delete/:id', function (req, res) {
  client.query('delete from Users where id=?', [req.params.id], function() {
    res.redirect('/')
  })
})

app.get('/src/insert', function (req, res) {
    fs.readFile('src/insert.html', 'utf8', function (err, data) {
      res.send(data)
    })
})

app.post('/insert', function (req, res) {

})

app.get('/edit/:id', function (req, res) {

})

app.post('/edit/:id', function (req, res) {

})