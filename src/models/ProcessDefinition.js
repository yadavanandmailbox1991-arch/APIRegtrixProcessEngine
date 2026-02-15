const { v4: uuidv4 } = require('uuid');

class ProcessDefinition {
  constructor(name, description, version = '1.0', definition) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.version = version;
    this.definition = definition; // BPMN or workflow definition
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      version: this.version,
      definition: this.definition,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = ProcessDefinition;
