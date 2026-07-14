const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { updateTask, deleteTask } = require('../controllers/taskController');

// All routes require authentication
router.use(auth);

router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;
