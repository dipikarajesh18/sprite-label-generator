const mysql = require("mysql");

const connection = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b35ad572883ea6',
    password: '3c164730',
    database: 'heroku_539ff7e32e2cf6f'
});

module.exports = connection;