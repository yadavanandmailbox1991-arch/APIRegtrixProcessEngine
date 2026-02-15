const { v4: uuidv4 } = require('uuid');

class ProcessInstance {
  constructor(processDefinitionId, processDefinitionName, variables = {}) {
    this.id = uuidv4();
    this.processDefinitionId = processDefinitionId;
    this.processDefinitionName = processDefinitionName;
    this.status = 'ACTIVE'; // ACTIVE, SUSPENDED, COMPLETED, TERMINATED
    this.variables = variables;
    this.startTime = new Date();
    this.endTime = null;
  }

  suspend() {
    if (this.status === 'ACTIVE') {
      this.status = 'SUSPENDED';
      return true;
    }
    return false;
  }

  resume() {
    if (this.status === 'SUSPENDED') {
      this.status = 'ACTIVE';
      return true;
    }
    return false;
  }

  complete() {
    if (this.status === 'ACTIVE' || this.status === 'SUSPENDED') {
      this.status = 'COMPLETED';
      this.endTime = new Date();
      return true;
    }
    return false;
  }

  terminate() {
    if (this.status === 'ACTIVE' || this.status === 'SUSPENDED') {
      this.status = 'TERMINATED';
      this.endTime = new Date();
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      processDefinitionId: this.processDefinitionId,
      processDefinitionName: this.processDefinitionName,
      status: this.status,
      variables: this.variables,
      startTime: this.startTime,
      endTime: this.endTime
    };
  }
}

module.exports = ProcessInstance;
