const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.STRING(28),
        allowNull: false,
        primaryKey: true, // Establecer como clave primaria
        autoIncrement: false, // Deshabilitar el autoincremento
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validation: {
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.ENUM( "Customer", "Admin", "Manager" ),
        allowNull: false,
        defaultValue: "Customer",
      },
      disable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    { timestamps: false }
  );
};
