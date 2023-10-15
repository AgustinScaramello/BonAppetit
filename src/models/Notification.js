const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Notification", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    new: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    idProduct: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
