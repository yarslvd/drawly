const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  return sequelize.define(
    "participants",
    {
      canvas_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "canvases",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "participants",
      schema: "public",
      timestamps: false,
    }
  );
};
