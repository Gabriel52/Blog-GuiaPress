const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

//###### Variavel de conexão
const connection = new Sequelize(process.env.MYSQL_DATABASE_NAME,process.env.MYSQL_DATABASE_USER,process.env.MYSQL_DATABASE_PASSWORD,{
    host: process.env.MYSQL_DATABASE_HOST,
    dialect: 'mysql',
    timezone: '-03:00'
});

// Impirtando a conexão
module.exports = connection;