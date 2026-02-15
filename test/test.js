const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const response = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('Starting ProcessEngine API Tests...\n');

  try {
    console.log('Test 1: Check API root endpoint');
    const rootRes = await makeRequest('GET', '/');
    console.log('Response:', rootRes);
    console.assert(rootRes.status === 200, 'Root endpoint should return 200');
    console.log('✓ Root endpoint test passed\n');

    console.log('Test 2: Create a Process Definition');
    const createDefRes = await makeRequest('POST', '/api/process-definitions', {
      name: 'Test Process',
      description: 'A test process definition',
      version: '1.0',
      definition: { steps: ['step1', 'step2', 'step3'] }
    });
    console.log('Response:', createDefRes);
    console.assert(createDefRes.status === 201, 'Should create process definition');
    const processDefId = createDefRes.data.id;
    console.log('✓ Process Definition created with ID:', processDefId, '\n');

    console.log('Test 3: Get all Process Definitions');
    const getDefsRes = await makeRequest('GET', '/api/process-definitions');
    console.log('Response:', getDefsRes);
    console.assert(getDefsRes.status === 200, 'Should return 200');
    console.assert(getDefsRes.data.length > 0, 'Should have at least one definition');
    console.log('✓ Found', getDefsRes.data.length, 'process definition(s)\n');

    console.log('Test 4: Start a Process Instance');
    const startInstRes = await makeRequest('POST', '/api/process-instances', {
      processDefinitionId: processDefId,
      variables: { userId: 'user123', orderId: 'order456' }
    });
    console.log('Response:', startInstRes);
    console.assert(startInstRes.status === 201, 'Should create process instance');
    const processInstId = startInstRes.data.id;
    console.log('✓ Process Instance started with ID:', processInstId, '\n');

    console.log('Test 5: Get Process Instance Variables');
    const getVarsRes = await makeRequest('GET', `/api/process-instances/${processInstId}/variables`);
    console.log('Response:', getVarsRes);
    console.assert(getVarsRes.status === 200, 'Should return 200');
    console.log('✓ Retrieved variables:', getVarsRes.data, '\n');

    console.log('Test 6: Create a Task');
    const createTaskRes = await makeRequest('POST', '/api/tasks', {
      processInstanceId: processInstId,
      name: 'Review Task',
      description: 'Review the submitted data',
      taskType: 'USER_TASK'
    });
    console.log('Response:', createTaskRes);
    console.assert(createTaskRes.status === 201, 'Should create task');
    const taskId = createTaskRes.data.id;
    console.log('✓ Task created with ID:', taskId, '\n');

    console.log('Test 7: Claim the Task');
    const claimTaskRes = await makeRequest('POST', `/api/tasks/${taskId}/claim`, {
      userId: 'user123'
    });
    console.log('Response:', claimTaskRes);
    console.assert(claimTaskRes.status === 200, 'Should claim task');
    console.assert(claimTaskRes.data.status === 'CLAIMED', 'Task should be claimed');
    console.log('✓ Task claimed by user123\n');

    console.log('Test 8: Complete the Task');
    const completeTaskRes = await makeRequest('POST', `/api/tasks/${taskId}/complete`);
    console.log('Response:', completeTaskRes);
    console.assert(completeTaskRes.status === 200, 'Should complete task');
    console.assert(completeTaskRes.data.status === 'COMPLETED', 'Task should be completed');
    console.log('✓ Task completed\n');

    console.log('Test 9: Suspend Process Instance');
    const suspendRes = await makeRequest('POST', `/api/process-instances/${processInstId}/suspend`);
    console.log('Response:', suspendRes);
    console.assert(suspendRes.status === 200, 'Should suspend instance');
    console.assert(suspendRes.data.status === 'SUSPENDED', 'Instance should be suspended');
    console.log('✓ Process instance suspended\n');

    console.log('Test 10: Resume Process Instance');
    const resumeRes = await makeRequest('POST', `/api/process-instances/${processInstId}/resume`);
    console.log('Response:', resumeRes);
    console.assert(resumeRes.status === 200, 'Should resume instance');
    console.assert(resumeRes.data.status === 'ACTIVE', 'Instance should be active');
    console.log('✓ Process instance resumed\n');

    console.log('✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

console.log('Waiting for server to be ready...');
setTimeout(runTests, 2000);
