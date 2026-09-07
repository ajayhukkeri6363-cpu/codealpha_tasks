const express = require('express');
const router = express.Router();
const { createTask, updateTask, reorderTasks, deleteTask } = require('../controllers/taskController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createTask);
router.post('/reorder', protect, reorderTasks);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);
router.route('/:taskId/comments').get(protect, getComments).post(protect, addComment);

module.exports = router;