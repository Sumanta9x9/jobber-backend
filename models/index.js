'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};
const DB_URL = process.env.DB_URL || 'mysql://tibetsik_jalan:'+encodeURIComponent('s2VrTaiMXQrV')+'@enteno.co.in:3306/tibetsik_jalan'
//'mysql://tibetsik_secondop:CsX4?&_xxVFG@enteno.co.in:3306/tibetsik_secondop' 
let sequelize = new Sequelize(DB_URL, {
    dialect: 'mysql',
    //host: Environment.db_details.host,
    //port: Environment.db_details.port,
    reconnect: true,
    logging: (data) => {
        console.log(data)
    },
    pool: {
        max: 1
    }
})

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize.sync({ alter: true });//!process.env.PRODUCTION 

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
