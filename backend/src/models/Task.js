const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'Judul task tidak boleh kosong.' } },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('todo', 'in_progress', 'done'),
        defaultValue: 'todo',
        allowNull: false,
      },
      deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: 'tasks',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Task;
};
