const { Project, Task } = require('../models');

/**
 * GET /api/projects
 * Returns all projects belonging to the authenticated user.
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
    });
    return res.json(projects);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/projects
 * Creates a new project for the authenticated user.
 */
const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Nama project wajib diisi.' });
    }
    const project = await Project.create({
      user_id: req.user.id,
      name: name.trim(),
      description: description || null,
    });
    return res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/projects/:id
 * Returns a single project with its tasks. Checks ownership.
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{ model: Task, as: 'Tasks', order: [['created_at', 'DESC']] }],
    });
    if (!project) {
      return res.status(404).json({ message: 'Project tidak ditemukan.' });
    }
    return res.json(project);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/projects/:id
 * Updates a project. Only the owner can update.
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!project) {
      return res.status(404).json({ message: 'Project tidak ditemukan.' });
    }
    const { name, description } = req.body;
    if (name !== undefined) project.name = name.trim();
    if (description !== undefined) project.description = description;
    await project.save();
    return res.json(project);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/projects/:id
 * Deletes a project. Cascades to all tasks. Only owner can delete.
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!project) {
      return res.status(404).json({ message: 'Project tidak ditemukan.' });
    }
    await project.destroy();
    return res.json({ message: 'Project berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProjects, createProject, getProjectById, updateProject, deleteProject };
