const http = require('http');
const app = require('./lib/app');

const server = http.createServer(app);

server.listen(7890, () => console.log('server is running'));
