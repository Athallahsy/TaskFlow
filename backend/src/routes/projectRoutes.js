const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { getTasks, createTask } = require('../controllers/taskController');

// All routes require authentication
router.use(auth);

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Nested task routes under projects
router.get('/:projectId/tasks', getTasks);
router.post('/:projectId/tasks', createTask);

module.exports = router;
