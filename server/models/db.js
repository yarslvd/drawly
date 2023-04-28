const Sequelize = require('sequelize');
const { startTokensCleaner } = require('../runners/tokens-cleaner');
const {setDefaultData} = require("../helpers/default-data");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect : 'postgres',
  logging: false,
});

let users = require("./users")(sequelize);
let tokens = require("./tokens")(sequelize);

(async () => {await sequelize.sync()
    .then(() => {
        console.log('DB was created');
        startTokensCleaner(tokens);
        setDefaultData({
            sequelize : sequelize,
            users : users,
            tokens: tokens,
        });
    })
    .catch((error) => {
        console.log('Some error happened, during creating db: ', error);
    })
  })()

module.exports = { 
  sequelize : sequelize,
  users : users,
  tokens: tokens,
};