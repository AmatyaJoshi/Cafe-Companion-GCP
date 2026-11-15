import http from 'http';

function testEndpoint(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing Real-time Gateway endpoints...');
  try {
    const health = await testEndpoint('/health');
    console.log('GET /health:', health.status, health.body.service);

    const orders = await testEndpoint('/api/orders');
    console.log('GET /api/orders:', orders.status, `count: ${orders.body.orders.length}`);

    const presence = await testEndpoint('/api/presence');
    console.log('GET /api/presence:', presence.status, `patrons: ${presence.body.patrons.length}`);

    console.log('✅ All Real-time Express tests passed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

run();
