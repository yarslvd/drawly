const Sequelize = require("sequelize");
const { startTokensCleaner } = require("../runners/tokens-cleaner");
const { setDefaultData } = require("../helpers/default-data");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

let users = require("../models/users")(sequelize);
let canvases = require("../models/canvases")(sequelize);
let participants = require("../models/participants")(sequelize);
let tokens = require("../models/tokens")(sequelize);

participants.belongsTo(canvases, { as: "canvas", foreignKey: "canvas_id" });
canvases.hasMany(participants, { as: "participants", foreignKey: "canvas_id" });
participants.belongsTo(users, { as: "user", foreignKey: "user_id" });
users.hasMany(participants, { as: "participants", foreignKey: "user_id" });

(async () => {
  await sequelize
    .sync()
    .then(() => {
      console.log("DB was created");
      startTokensCleaner(tokens);
      setDefaultData({
        sequelize: sequelize,
        users: users,
        tokens: tokens,
      });
    })
    .catch((error) => {
      console.log("Some error happened, during creating db: ", error);
    });
})();

module.exports = {
  sequelize: sequelize,
  tokens: tokens,
  users: users,
  canvases: canvases,
  participants: participants,
};
