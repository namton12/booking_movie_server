// get the client
const mysql = require('mysql2/promise');

// get the promise implementation, we will use bluebird
const bluebird = require('bluebird');

// create the connection, specify bluebird as Promise
const connection = mysql.createPool({host:'localhost', user: 'root',port: 3306, database: 'bookingmovie', Promise: bluebird});

module.exports= connection