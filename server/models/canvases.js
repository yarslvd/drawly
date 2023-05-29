const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  return sequelize.define(
    "canvases",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "CANVAS",
      },
      content: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      preview: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "CANVAS_URL",
      },
    },
    {
      sequelize,
      tableName: "canvases",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "canvases_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
