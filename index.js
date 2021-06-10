require("dotenv").config();

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

//8080 port server
app.listen(8080, () => {
    console.log('Server is running at : http://127.0.0.1:8080');
})

//get index.ejs
app.get('/', (req, res) => {
    fs.readFile('index.ejs', 'utf8', (err, data) => {
        client.query('select * from Users', (err, results) => {
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

//insert : C (create)
app.get('/src/insert', (req, res) => {
    fs.readFile('src/insert.html', 'utf8', (err, data) => {
        res.send(data)
    })
})

app.post('/src/insert', (req, res) => {
    const body = req.body;

    client.query('insert into Users (Name, OS, Version) values (?, ?, ?);', [
        body.Name,
        body.OS,
        body.Version
    ], () => {
        res.redirect('/')
    })
})

//Search : R (Reading)
app.post('/search-query', (req, res) => {
    var word = `select * from Users where Name like '%${req.body.Name}%'`;
    fs.readFile('src/search.ejs', 'utf8', (err, data) => {
        client.query(word, function (err, results) {
            if (err) {
                res.send(err)
            } else {
                res.send(ejs.render(data, {
                    data: results
                })
                )
            }
        })
    })
})

//Edit : U (Update)
app.get('/src/edit/:id', (req, res) => {
    fs.readFile('src/edit.ejs', 'utf8', (err, data) => {
        client.query('select * from Users where id = ?', [req.params.id], (err, result) => {
            res.send(ejs.render(data, {
                data: result[0]
            }))
        })
    })
})

app.post('/src/edit/:id', (req, res) => {
    const body = req.body;

    client.query('update Users Set Name=?, OS=?, Version=? where id=? ', [
        body.Name, body.OS, body.Version, req.params.id
    ], () => {
        res.redirect('/')
    })
})

//delete : D (Delete)
app.get('/delete/:id', (req, res) => {
    client.query('delete from Users where id=?', [req.params.id], () => {
        res.redirect('/')
    })
})
