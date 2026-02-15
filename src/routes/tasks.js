const express = require('express');
const router = express.Router();
const taskController = require('../controllers/TaskController');

router.post('/', (req, res) => taskController.createTask(req, res));
router.get('/', (req, res) => taskController.getAllTasks(req, res));
router.get('/:id', (req, res) => taskController.getTaskById(req, res));
router.post('/:id/claim', (req, res) => taskController.claimTask(req, res));
router.post('/:id/complete', (req, res) => taskController.completeTask(req, res));
router.post('/:id/delegate', (req, res) => taskController.delegateTask(req, res));

module.exports = router;
