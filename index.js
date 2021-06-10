require("dotenv").config();
require("sanitize");
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const mysql = require('mysql');

// dotenv package를 통해 .env에 값을 저장하고 활용
const client = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB
})

const app = express();

app.use(express.urlencoded({
  extended: false
}))

app.listen(8080, function () {
  console.log('Server is running at : http://127.0.0.1:8080');
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
  client.query('delete from Users where id=?', [req.params.id], function () {
    res.redirect('/')
  })
})

app.get('/src/insert', function (req, res) {
  fs.readFile('src/insert.html', 'utf8', function (err, data) {
    res.send(data)
  })
})

app.post('/src/insert', function (req, res) {
  const body = req.body;

  client.query('insert into Users (Name, OS, Version) values (?, ?, ?);', [
    body.Name,
    body.OS,
    body.Version
  ], function () {
    res.redirect('/')
  })
})
app.get('/src/edit/:id', function (req, res) {
  fs.readFile('src/edit.ejs', 'utf8', function (err, data) {
    client.query('select * from Users where id = ?', [req.params.id], function (err, result) {
      res.send(ejs.render(data, {
        data: result[0]
      }))
    })
  })
})

app.post('/src/edit/:id', function (req, res) {
  const body = req.body;

  client.query('update Users Set Name=?, OS=?, Version=? where id=? ', [
    body.Name, body.OS, body.Version, req.params.id
  ], function () {
    res.redirect('/')
  })
})

  app.get('/search', (req, res) => {
    client.query('SELECT * FROM Users WHERE Name LIKE ‘%C%’', (error, rows) => {
      if (error) throw error;
      console.log('User info is: ', rows);
      res.send(rows);
    });
  });
