const mysql = require('mysql')

const client = mysql.createConnection({
  user: 'ukisgod',
  password: 'ukisgod12@@',
  database: 'ukisgod'
})

client.query('SELECT * FROM AlbumList', function (err, result, fields) {
  if (err) {
    console.log('DB Query incorrect')
  } else {
    console.log(result)
  }
})
