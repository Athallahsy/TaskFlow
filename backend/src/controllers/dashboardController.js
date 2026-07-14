const { Project, Task, sequelize } = require('../models');

/**
 * GET /api/dashboard/summary
 * Returns aggregated stats for the authenticated user:
 * - Total projects
 * - Task counts per status (todo / in_progress / done)
 * - 5 most recent projects
 */
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalProjects = await Project.count({ where: { user_id: userId } });

    // Get project IDs for this user
    const userProjects = await Project.findAll({
      where: { user_id: userId },
      attributes: ['id'],
      raw: true,
    });
    const projectIds = userProjects.map((p) => p.id);

    const taskStats = { todo: 0, in_progress: 0, done: 0 };
    if (projectIds.length > 0) {
      const rows = await Task.findAll({
        where: { project_id: projectIds },
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status'],
        raw: true,
      });
      rows.forEach((row) => {
        taskStats[row.status] = parseInt(row.count, 10);
      });
    }

    const recentProjects = await Project.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 5,
    });

    return res.json({
      totalProjects,
      taskStats,
      recentProjects,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary };
