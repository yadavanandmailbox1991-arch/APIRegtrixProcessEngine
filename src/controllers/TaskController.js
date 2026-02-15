const Task = require('../models/Task');
const storage = require('../storage/InMemoryStorage');

class TaskController {
  createTask(req, res) {
    try {
      const { processInstanceId, name, description, taskType } = req.body;

      if (!processInstanceId || !name) {
        return res.status(400).json({
          error: 'Process instance ID and name are required'
        });
      }

      const processInstance = storage.getProcessInstance(processInstanceId);
      if (!processInstance) {
        return res.status(404).json({
          error: 'Process instance not found'
        });
      }

      const task = new Task(
        processInstanceId,
        name,
        description || '',
        taskType || 'USER_TASK'
      );

      storage.saveTask(task);

      res.status(201).json(task.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getAllTasks(req, res) {
    try {
      const { processInstanceId, status, assignee } = req.query;
      let tasks = storage.getAllTasks();

      if (processInstanceId) {
        tasks = tasks.filter(task => task.processInstanceId === processInstanceId);
      }

      if (status) {
        tasks = tasks.filter(task => task.status === status);
      }

      if (assignee) {
        tasks = tasks.filter(task => task.assignee === assignee);
      }

      res.json(tasks.map(task => task.toJSON()));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = storage.getTask(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  claimTask(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const task = storage.getTask(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const success = task.claim(userId);
      if (!success) {
        return res.status(400).json({
          error: 'Cannot claim task in current state'
        });
      }

      storage.saveTask(task);
      res.json(task.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  completeTask(req, res) {
    try {
      const { id } = req.params;
      const task = storage.getTask(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const success = task.complete();
      if (!success) {
        return res.status(400).json({
          error: 'Cannot complete task in current state'
        });
      }

      storage.saveTask(task);
      res.json(task.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  delegateTask(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const task = storage.getTask(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const success = task.delegate(userId);
      if (!success) {
        return res.status(400).json({
          error: 'Cannot delegate task in current state'
        });
      }

      storage.saveTask(task);
      res.json(task.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TaskController();
