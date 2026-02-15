const ProcessInstance = require('../models/ProcessInstance');
const storage = require('../storage/InMemoryStorage');

class ProcessInstanceController {
  startProcessInstance(req, res) {
    try {
      const { processDefinitionId, variables } = req.body;

      if (!processDefinitionId) {
        return res.status(400).json({
          error: 'Process definition ID is required'
        });
      }

      const processDefinition = storage.getProcessDefinition(processDefinitionId);
      
      if (!processDefinition) {
        return res.status(404).json({
          error: 'Process definition not found'
        });
      }

      const processInstance = new ProcessInstance(
        processDefinitionId,
        processDefinition.name,
        variables || {}
      );

      storage.saveProcessInstance(processInstance);

      res.status(201).json(processInstance.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getAllProcessInstances(req, res) {
    try {
      const instances = storage.getAllProcessInstances();
      res.json(instances.map(inst => inst.toJSON()));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getProcessInstanceById(req, res) {
    try {
      const { id } = req.params;
      const instance = storage.getProcessInstance(id);

      if (!instance) {
        return res.status(404).json({ error: 'Process instance not found' });
      }

      res.json(instance.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  deleteProcessInstance(req, res) {
    try {
      const { id } = req.params;
      const instance = storage.getProcessInstance(id);

      if (!instance) {
        return res.status(404).json({ error: 'Process instance not found' });
      }

      instance.terminate();
      storage.saveProcessInstance(instance);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  suspendProcessInstance(req, res) {
    try {
      const { id } = req.params;
      const instance = storage.getProcessInstance(id);

      if (!instance) {
        return res.status(404).json({ error: 'Process instance not found' });
      }

      const success = instance.suspend();
      if (!success) {
        return res.status(400).json({
          error: 'Cannot suspend process instance in current state'
        });
      }

      storage.saveProcessInstance(instance);
      res.json(instance.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  resumeProcessInstance(req, res) {
    try {
      const { id } = req.params;
      const instance = storage.getProcessInstance(id);

      if (!instance) {
        return res.status(404).json({ error: 'Process instance not found' });
      }

      const success = instance.resume();
      if (!success) {
        return res.status(400).json({
          error: 'Cannot resume process instance in current state'
        });
      }

      storage.saveProcessInstance(instance);
      res.json(instance.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getProcessInstanceVariables(req, res) {
    try {
      const { id } = req.params;
      const instance = storage.getProcessInstance(id);

      if (!instance) {
        return res.status(404).json({ error: 'Process instance not found' });
      }

      res.json(instance.variables);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  setProcessInstanceVariables(req, res) {
    try {
      const { id } = req.params;
      const instance = storage.getProcessInstance(id);

      if (!instance) {
        return res.status(404).json({ error: 'Process instance not found' });
      }

      instance.variables = { ...instance.variables, ...req.body };
      storage.saveProcessInstance(instance);

      res.json(instance.variables);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProcessInstanceController();
