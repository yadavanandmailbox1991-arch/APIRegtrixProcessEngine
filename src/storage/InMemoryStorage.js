class InMemoryStorage {
  constructor() {
    this.processDefinitions = new Map();
    this.processInstances = new Map();
    this.tasks = new Map();
  }

  // Process Definitions
  saveProcessDefinition(processDefinition) {
    this.processDefinitions.set(processDefinition.id, processDefinition);
    return processDefinition;
  }

  getProcessDefinition(id) {
    return this.processDefinitions.get(id);
  }

  getAllProcessDefinitions() {
    return Array.from(this.processDefinitions.values());
  }

  deleteProcessDefinition(id) {
    return this.processDefinitions.delete(id);
  }

  // Process Instances
  saveProcessInstance(processInstance) {
    this.processInstances.set(processInstance.id, processInstance);
    return processInstance;
  }

  getProcessInstance(id) {
    return this.processInstances.get(id);
  }

  getAllProcessInstances() {
    return Array.from(this.processInstances.values());
  }

  deleteProcessInstance(id) {
    return this.processInstances.delete(id);
  }

  // Tasks
  saveTask(task) {
    this.tasks.set(task.id, task);
    return task;
  }

  getTask(id) {
    return this.tasks.get(id);
  }

  getAllTasks() {
    return Array.from(this.tasks.values());
  }

  getTasksByProcessInstanceId(processInstanceId) {
    return Array.from(this.tasks.values()).filter(
      task => task.processInstanceId === processInstanceId
    );
  }

  deleteTask(id) {
    return this.tasks.delete(id);
  }
}

module.exports = new InMemoryStorage();
