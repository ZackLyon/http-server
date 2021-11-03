const http = require('http');
const app = require('./lib/app').default;

const server = http.createServer(app);

server.listen(7890);
