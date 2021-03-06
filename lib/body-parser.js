const methods = ['POST', 'PUT', 'PATCH'];

module.exports = (req) => {
  if (!methods.includes(req.method)) return null;

  return new Promise((resolve, reject) => {
    if (req.headers['content-type'] !== 'application/json') {
      reject('Incorrect content type. Must be application/json.');
      return;
    }

    let data = '';
    //accumulate all the data using this event listener. which is receiveing the chunks that the EventEmitter is emitting
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        reject('Bad JSON during parse');
      }
    });
  });
};
