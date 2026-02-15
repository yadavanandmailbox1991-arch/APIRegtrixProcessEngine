const express = require('express');
const bodyParser = require('body-parser');

const processDefinitionsRouter = require('./routes/processDefinitions');
const processInstancesRouter = require('./routes/processInstances');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'APIRegtrixProcessEngine - Process Engine API',
    version: '1.0.0',
    endpoints: {
      processDefinitions: '/api/process-definitions',
      processInstances: '/api/process-instances',
      tasks: '/api/tasks'
    }
  });
});

app.use('/api/process-definitions', processDefinitionsRouter);
app.use('/api/process-instances', processInstancesRouter);
app.use('/api/tasks', tasksRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Process Engine API is running on port ${PORT}`);
  });
}

module.exports = app;
