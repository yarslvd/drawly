const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  return sequelize.define(
    "tokens",
    {
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
      },
      valid_till: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "tokens",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "tokens_pkey",
          unique: true,
          fields: [{ name: "token" }],
        },
      ],
    }
  );
};
