const ProcessDefinition = require('../models/ProcessDefinition');
const storage = require('../storage/InMemoryStorage');

class ProcessDefinitionController {
  createProcessDefinition(req, res) {
    try {
      const { name, description, version, definition } = req.body;

      if (!name || !definition) {
        return res.status(400).json({
          error: 'Name and definition are required'
        });
      }

      const processDefinition = new ProcessDefinition(
        name,
        description || '',
        version || '1.0',
        definition
      );

      storage.saveProcessDefinition(processDefinition);

      res.status(201).json(processDefinition.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getAllProcessDefinitions(req, res) {
    try {
      const definitions = storage.getAllProcessDefinitions();
      res.json(definitions.map(def => def.toJSON()));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getProcessDefinitionById(req, res) {
    try {
      const { id } = req.params;
      const definition = storage.getProcessDefinition(id);

      if (!definition) {
        return res.status(404).json({ error: 'Process definition not found' });
      }

      res.json(definition.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  deleteProcessDefinition(req, res) {
    try {
      const { id } = req.params;
      const deleted = storage.deleteProcessDefinition(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Process definition not found' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProcessDefinitionController();
