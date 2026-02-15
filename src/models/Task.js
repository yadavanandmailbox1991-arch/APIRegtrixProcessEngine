const { v4: uuidv4 } = require('uuid');

class Task {
  constructor(processInstanceId, name, description, taskType = 'USER_TASK') {
    this.id = uuidv4();
    this.processInstanceId = processInstanceId;
    this.name = name;
    this.description = description;
    this.taskType = taskType; // USER_TASK, SERVICE_TASK, etc.
    this.assignee = null;
    this.status = 'OPEN'; // OPEN, CLAIMED, COMPLETED, DELEGATED
    this.createdAt = new Date();
    this.completedAt = null;
  }

  claim(userId) {
    if (this.status === 'OPEN') {
      this.assignee = userId;
      this.status = 'CLAIMED';
      return true;
    }
    return false;
  }

  complete() {
    if (this.status === 'CLAIMED' || this.status === 'OPEN') {
      this.status = 'COMPLETED';
      this.completedAt = new Date();
      return true;
    }
    return false;
  }

  delegate(userId) {
    if (this.status === 'CLAIMED' || this.status === 'OPEN') {
      this.assignee = userId;
      this.status = 'DELEGATED';
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      processInstanceId: this.processInstanceId,
      name: this.name,
      description: this.description,
      taskType: this.taskType,
      assignee: this.assignee,
      status: this.status,
      createdAt: this.createdAt,
      completedAt: this.completedAt
    };
  }
}

module.exports = Task;
