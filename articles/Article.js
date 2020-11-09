const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Categories');

const Articles = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Relacionamento entre tabelas
Category.hasMany(Articles);
Articles.belongsTo(Category);

Articles.sync({force:false}).then(()=>{
    console.log('created articles table')
});
module.exports = Articles;