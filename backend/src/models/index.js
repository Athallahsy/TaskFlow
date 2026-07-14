const sequelize = require('../config/database');
const UserModel = require('./User');
const ProjectModel = require('./Project');
const TaskModel = require('./Task');

const User = UserModel(sequelize);
const Project = ProjectModel(sequelize);
const Task = TaskModel(sequelize);

// Associations
User.hasMany(Project, { foreignKey: 'user_id', onDelete: 'CASCADE', hooks: true });
Project.belongsTo(User, { foreignKey: 'user_id' });

Project.hasMany(Task, { foreignKey: 'project_id', onDelete: 'CASCADE', hooks: true, as: 'Tasks' });
Task.belongsTo(Project, { foreignKey: 'project_id', as: 'Project' });

module.exports = { sequelize, User, Project, Task };
