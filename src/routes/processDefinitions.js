const express = require('express');
const router = express.Router();
const processDefinitionController = require('../controllers/ProcessDefinitionController');

router.post('/', (req, res) => processDefinitionController.createProcessDefinition(req, res));
router.get('/', (req, res) => processDefinitionController.getAllProcessDefinitions(req, res));
router.get('/:id', (req, res) => processDefinitionController.getProcessDefinitionById(req, res));
router.delete('/:id', (req, res) => processDefinitionController.deleteProcessDefinition(req, res));

module.exports = router;
