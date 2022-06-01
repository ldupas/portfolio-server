const connection = require('../db-config');

const findUserByEmail = (email) => 
    connection
    .promise()
    .query('SELECT * FROM user WHERE email=?',
    [email]);

const insertUser = (email, password) =>
    connection
    .promise() 
    .query('INSERT INTO user (`email`, `password`) VALUES (?, ?)',
    [email, password]); 

module.exports = {
    findUserByEmail,
    insertUser,
};