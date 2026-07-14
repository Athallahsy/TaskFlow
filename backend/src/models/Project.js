const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define(
    'Project',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { notEmpty: { msg: 'Nama project tidak boleh kosong.' } },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'projects',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Project;
};
