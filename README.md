# APIRegtrixProcessEngine

A lightweight Process Engine API built with Node.js and Express. This API provides workflow and business process management capabilities including process definitions, process instances, and task management.

## Features

- 🔧 **Process Definitions**: Define and manage workflow templates
- ⚙️ **Process Instances**: Execute and monitor process instances
- ✅ **Task Management**: Create, claim, complete, and delegate tasks
- 💾 **Variable Storage**: Store and retrieve process variables
- 🔄 **Process Control**: Suspend and resume process instances

## Installation

```bash
npm install
```

## Usage

### Start the Server

```bash
npm start
```

The API server will start on port 3000 (or the port specified in the PORT environment variable).

### Run Tests

```bash
npm test
```

## API Endpoints

### Root

- `GET /` - API information and available endpoints

### Process Definitions

- `POST /api/process-definitions` - Create a new process definition
- `GET /api/process-definitions` - List all process definitions
- `GET /api/process-definitions/:id` - Get a specific process definition
- `DELETE /api/process-definitions/:id` - Delete a process definition

### Process Instances

- `POST /api/process-instances` - Start a new process instance
- `GET /api/process-instances` - List all process instances
- `GET /api/process-instances/:id` - Get a specific process instance
- `DELETE /api/process-instances/:id` - Terminate a process instance
- `POST /api/process-instances/:id/suspend` - Suspend a process instance
- `POST /api/process-instances/:id/resume` - Resume a suspended process instance
- `GET /api/process-instances/:id/variables` - Get process instance variables
- `POST /api/process-instances/:id/variables` - Set process instance variables

### Tasks

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - List all tasks (supports filtering by processInstanceId, status, assignee)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks/:id/claim` - Claim a task
- `POST /api/tasks/:id/complete` - Complete a task
- `POST /api/tasks/:id/delegate` - Delegate a task to another user

## Example Usage

### 1. Create a Process Definition

```bash
curl -X POST http://localhost:3000/api/process-definitions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Order Processing",
    "description": "Process for handling customer orders",
    "version": "1.0",
    "definition": {
      "steps": ["validate", "approve", "fulfill", "ship"]
    }
  }'
```

### 2. Start a Process Instance

```bash
curl -X POST http://localhost:3000/api/process-instances \
  -H "Content-Type: application/json" \
  -d '{
    "processDefinitionId": "YOUR_PROCESS_DEFINITION_ID",
    "variables": {
      "orderId": "12345",
      "customerId": "CUST001",
      "amount": 99.99
    }
  }'
```

### 3. Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "processInstanceId": "YOUR_PROCESS_INSTANCE_ID",
    "name": "Approve Order",
    "description": "Review and approve the customer order",
    "taskType": "USER_TASK"
  }'
```

### 4. Claim a Task

```bash
curl -X POST http://localhost:3000/api/tasks/YOUR_TASK_ID/claim \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123"
  }'
```

### 5. Complete a Task

```bash
curl -X POST http://localhost:3000/api/tasks/YOUR_TASK_ID/complete \
  -H "Content-Type: application/json"
```

## Data Models

### Process Definition

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "version": "string",
  "definition": "object",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Process Instance

```json
{
  "id": "uuid",
  "processDefinitionId": "uuid",
  "processDefinitionName": "string",
  "status": "ACTIVE|SUSPENDED|COMPLETED|TERMINATED",
  "variables": "object",
  "startTime": "datetime",
  "endTime": "datetime|null"
}
```

### Task

```json
{
  "id": "uuid",
  "processInstanceId": "uuid",
  "name": "string",
  "description": "string",
  "taskType": "USER_TASK|SERVICE_TASK",
  "assignee": "string|null",
  "status": "OPEN|CLAIMED|COMPLETED|DELEGATED",
  "createdAt": "datetime",
  "completedAt": "datetime|null"
}
```

## Architecture

The application follows a layered architecture:

- **Models**: Data structures for Process Definitions, Process Instances, and Tasks
- **Controllers**: Business logic for handling API requests
- **Routes**: REST API endpoint definitions
- **Storage**: In-memory data storage (can be replaced with a database)

## Technology Stack

- Node.js
- Express.js
- body-parser
- uuid

## License

ISC
