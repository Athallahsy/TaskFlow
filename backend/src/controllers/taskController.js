const { Task, Project } = require('../models');

/**
 * GET /api/projects/:projectId/tasks
 * Returns tasks for a project. Supports ?status= filter.
 * Verifies project ownership before returning tasks.
 */
const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ where: { id: projectId, user_id: req.user.id } });
    if (!project) {
      return res.status(404).json({ message: 'Project tidak ditemukan.' });
    }
    const where = { project_id: projectId };
    if (req.query.status) {
      const validStatuses = ['todo', 'in_progress', 'done'];
      if (!validStatuses.includes(req.query.status)) {
        return res.status(400).json({ message: 'Status tidak valid. Gunakan: todo, in_progress, atau done.' });
      }
      where.status = req.query.status;
    }
    const tasks = await Task.findAll({ where, order: [['created_at', 'DESC']] });
    return res.json(tasks);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/projects/:projectId/tasks
 * Creates a task inside a project. Verifies project ownership.
 */
const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ where: { id: projectId, user_id: req.user.id } });
    if (!project) {
      return res.status(404).json({ message: 'Project tidak ditemukan.' });
    }
    const { title, description, status, deadline } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Judul task wajib diisi.' });
    }
    const task = await Task.create({
      project_id: projectId,
      title: title.trim(),
      description: description || null,
      status: status || 'todo',
      deadline: deadline || null,
    });
    return res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/tasks/:id
 * Updates a task. Verifies ownership via project.
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: Project, as: 'Project' }],
    });
    if (!task || task.Project.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Task tidak ditemukan.' });
    }
    const { title, description, status, deadline } = req.body;
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (deadline !== undefined) task.deadline = deadline || null;
    await task.save();
    return res.json(task);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tasks/:id
 * Deletes a task. Verifies ownership via project.
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: Project, as: 'Project' }],
    });
    if (!task || task.Project.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Task tidak ditemukan.' });
    }
    await task.destroy();
    return res.json({ message: 'Task berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
