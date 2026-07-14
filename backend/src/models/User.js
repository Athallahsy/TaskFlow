const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: { msg: 'Nama tidak boleh kosong.' } },
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: { msg: 'Email sudah digunakan.' },
        validate: { isEmail: { msg: 'Format email tidak valid.' } },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return User;
};
