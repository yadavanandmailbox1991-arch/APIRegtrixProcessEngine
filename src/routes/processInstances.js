const express = require('express');
const router = express.Router();
const processInstanceController = require('../controllers/ProcessInstanceController');

router.post('/', (req, res) => processInstanceController.startProcessInstance(req, res));
router.get('/', (req, res) => processInstanceController.getAllProcessInstances(req, res));
router.get('/:id', (req, res) => processInstanceController.getProcessInstanceById(req, res));
router.delete('/:id', (req, res) => processInstanceController.deleteProcessInstance(req, res));
router.post('/:id/suspend', (req, res) => processInstanceController.suspendProcessInstance(req, res));
router.post('/:id/resume', (req, res) => processInstanceController.resumeProcessInstance(req, res));
router.get('/:id/variables', (req, res) => processInstanceController.getProcessInstanceVariables(req, res));
router.post('/:id/variables', (req, res) => processInstanceController.setProcessInstanceVariables(req, res));

module.exports = router;
