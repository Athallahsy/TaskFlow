const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getSummary } = require('../controllers/dashboardController');

router.use(auth);
router.get('/summary', getSummary);

module.exports = router;
