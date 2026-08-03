const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users/profile-image',
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer mock'
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});

req.on('error', e => console.error(e));
req.end();
