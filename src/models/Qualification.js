const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Qualification",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      sum: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
    },
    { timestamps: false }
  );
};
