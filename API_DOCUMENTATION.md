# API Documentation

## Overview

The APIRegtrixProcessEngine provides a RESTful API for managing business processes. This document describes all available endpoints, request/response formats, and usage examples.

## Base URL

```
http://localhost:3000
```

## Response Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful (no content to return)
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Process Definitions API

Process definitions are templates for workflows.

### Create Process Definition

**Endpoint:** `POST /api/process-definitions`

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string",
  "version": "string (default: '1.0')",
  "definition": "object (required)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Order Processing",
  "description": "Process for handling orders",
  "version": "1.0",
  "definition": { "steps": ["validate", "approve", "ship"] },
  "createdAt": "2026-02-15T14:00:00.000Z",
  "updatedAt": "2026-02-15T14:00:00.000Z"
}
```

### List Process Definitions

**Endpoint:** `GET /api/process-definitions`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Order Processing",
    "description": "Process for handling orders",
    "version": "1.0",
    "definition": { "steps": ["validate", "approve", "ship"] },
    "createdAt": "2026-02-15T14:00:00.000Z",
    "updatedAt": "2026-02-15T14:00:00.000Z"
  }
]
```

### Get Process Definition

**Endpoint:** `GET /api/process-definitions/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Order Processing",
  "description": "Process for handling orders",
  "version": "1.0",
  "definition": { "steps": ["validate", "approve", "ship"] },
  "createdAt": "2026-02-15T14:00:00.000Z",
  "updatedAt": "2026-02-15T14:00:00.000Z"
}
```

### Delete Process Definition

**Endpoint:** `DELETE /api/process-definitions/:id`

**Response:** `204 No Content`

---

## Process Instances API

Process instances are runtime executions of process definitions.

### Start Process Instance

**Endpoint:** `POST /api/process-instances`

**Request Body:**
```json
{
  "processDefinitionId": "uuid (required)",
  "variables": {
    "key": "value"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "processDefinitionId": "uuid",
  "processDefinitionName": "Order Processing",
  "status": "ACTIVE",
  "variables": { "orderId": "12345" },
  "startTime": "2026-02-15T14:00:00.000Z",
  "endTime": null
}
```

**Status Values:**
- `ACTIVE` - Instance is running
- `SUSPENDED` - Instance is paused
- `COMPLETED` - Instance finished successfully
- `TERMINATED` - Instance was stopped

### List Process Instances

**Endpoint:** `GET /api/process-instances`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "processDefinitionId": "uuid",
    "processDefinitionName": "Order Processing",
    "status": "ACTIVE",
    "variables": { "orderId": "12345" },
    "startTime": "2026-02-15T14:00:00.000Z",
    "endTime": null
  }
]
```

### Get Process Instance

**Endpoint:** `GET /api/process-instances/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "processDefinitionId": "uuid",
  "processDefinitionName": "Order Processing",
  "status": "ACTIVE",
  "variables": { "orderId": "12345" },
  "startTime": "2026-02-15T14:00:00.000Z",
  "endTime": null
}
```

### Delete Process Instance (Terminate)

**Endpoint:** `DELETE /api/process-instances/:id`

**Response:** `204 No Content`

### Suspend Process Instance

**Endpoint:** `POST /api/process-instances/:id/suspend`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "processDefinitionId": "uuid",
  "processDefinitionName": "Order Processing",
  "status": "SUSPENDED",
  "variables": { "orderId": "12345" },
  "startTime": "2026-02-15T14:00:00.000Z",
  "endTime": null
}
```

### Resume Process Instance

**Endpoint:** `POST /api/process-instances/:id/resume`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "processDefinitionId": "uuid",
  "processDefinitionName": "Order Processing",
  "status": "ACTIVE",
  "variables": { "orderId": "12345" },
  "startTime": "2026-02-15T14:00:00.000Z",
  "endTime": null
}
```

### Get Process Instance Variables

**Endpoint:** `GET /api/process-instances/:id/variables`

**Response:** `200 OK`
```json
{
  "orderId": "12345",
  "customerId": "CUST001",
  "amount": 99.99
}
```

### Set Process Instance Variables

**Endpoint:** `POST /api/process-instances/:id/variables`

**Request Body:**
```json
{
  "newKey": "newValue",
  "amount": 199.99
}
```

**Response:** `200 OK`
```json
{
  "orderId": "12345",
  "customerId": "CUST001",
  "amount": 199.99,
  "newKey": "newValue"
}
```

---

## Tasks API

Tasks represent work items in a process.

### Create Task

**Endpoint:** `POST /api/tasks`

**Request Body:**
```json
{
  "processInstanceId": "uuid (required)",
  "name": "string (required)",
  "description": "string",
  "taskType": "USER_TASK|SERVICE_TASK (default: USER_TASK)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "processInstanceId": "uuid",
  "name": "Approve Order",
  "description": "Review and approve",
  "taskType": "USER_TASK",
  "assignee": null,
  "status": "OPEN",
  "createdAt": "2026-02-15T14:00:00.000Z",
  "completedAt": null
}
```

**Status Values:**
- `OPEN` - Task is available
- `CLAIMED` - Task has been claimed by a user
- `COMPLETED` - Task is finished
- `DELEGATED` - Task has been reassigned

### List Tasks

**Endpoint:** `GET /api/tasks`

**Query Parameters:**
- `processInstanceId` - Filter by process instance
- `status` - Filter by status (OPEN, CLAIMED, COMPLETED, DELEGATED)
- `assignee` - Filter by assignee user ID

**Example:** `GET /api/tasks?status=OPEN&assignee=user123`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "processInstanceId": "uuid",
    "name": "Approve Order",
    "description": "Review and approve",
    "taskType": "USER_TASK",
    "assignee": "user123",
    "status": "CLAIMED",
    "createdAt": "2026-02-15T14:00:00.000Z",
    "completedAt": null
  }
]
```

### Get Task

**Endpoint:** `GET /api/tasks/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "processInstanceId": "uuid",
  "name": "Approve Order",
  "description": "Review and approve",
  "taskType": "USER_TASK",
  "assignee": "user123",
  "status": "CLAIMED",
  "createdAt": "2026-02-15T14:00:00.000Z",
  "completedAt": null
}
```

### Claim Task

**Endpoint:** `POST /api/tasks/:id/claim`

**Request Body:**
```json
{
  "userId": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "processInstanceId": "uuid",
  "name": "Approve Order",
  "description": "Review and approve",
  "taskType": "USER_TASK",
  "assignee": "user123",
  "status": "CLAIMED",
  "createdAt": "2026-02-15T14:00:00.000Z",
  "completedAt": null
}
```

### Complete Task

**Endpoint:** `POST /api/tasks/:id/complete`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "processInstanceId": "uuid",
  "name": "Approve Order",
  "description": "Review and approve",
  "taskType": "USER_TASK",
  "assignee": "user123",
  "status": "COMPLETED",
  "createdAt": "2026-02-15T14:00:00.000Z",
  "completedAt": "2026-02-15T14:05:00.000Z"
}
```

### Delegate Task

**Endpoint:** `POST /api/tasks/:id/delegate`

**Request Body:**
```json
{
  "userId": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "processInstanceId": "uuid",
  "name": "Approve Order",
  "description": "Review and approve",
  "taskType": "USER_TASK",
  "assignee": "user456",
  "status": "DELEGATED",
  "createdAt": "2026-02-15T14:00:00.000Z",
  "completedAt": null
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

**Examples:**

- `400 Bad Request`
```json
{
  "error": "Name and definition are required"
}
```

- `404 Not Found`
```json
{
  "error": "Process definition not found"
}
```

- `500 Internal Server Error`
```json
{
  "error": "Internal server error"
}
```

---

## Complete Workflow Example

Here's a complete example of creating and executing a process:

```bash
# 1. Create a process definition
curl -X POST http://localhost:3000/api/process-definitions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Order Processing",
    "description": "Handle customer orders",
    "version": "1.0",
    "definition": {
      "steps": ["validate", "approve", "ship"]
    }
  }'

# Save the returned ID as PROCESS_DEF_ID

# 2. Start a process instance
curl -X POST http://localhost:3000/api/process-instances \
  -H "Content-Type: application/json" \
  -d '{
    "processDefinitionId": "PROCESS_DEF_ID",
    "variables": {
      "orderId": "12345",
      "customerId": "CUST001"
    }
  }'

# Save the returned ID as PROCESS_INST_ID

# 3. Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "processInstanceId": "PROCESS_INST_ID",
    "name": "Approve Order",
    "description": "Review the order"
  }'

# Save the returned ID as TASK_ID

# 4. Claim the task
curl -X POST http://localhost:3000/api/tasks/TASK_ID/claim \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123"}'

# 5. Complete the task
curl -X POST http://localhost:3000/api/tasks/TASK_ID/complete \
  -H "Content-Type: application/json"

# 6. Check process instance status
curl http://localhost:3000/api/process-instances/PROCESS_INST_ID
```
