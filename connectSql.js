var mysql = require('mysql');
var connection = mysql.createConnection({host: '127.0.0.1', user: 'root', password: '', database: 'mysql'});

connection.connect();

connection.query('SELECT User,Column_name FROM  columns_priv LIMIT 0,5', function(err, rows, fields) {
    if (err)
        throw err;
    console.log('The data is: ', rows);
    // console.log(rows);
});

connection.end();
