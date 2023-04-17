const mysql = require("mysql");

const connection = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b50281fd4181c6',
    password: '12b4a1bb',
    database: 'heroku_2f2d25ae5fc707a'
});

module.exports = connection;