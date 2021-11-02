const methods = ['POST', 'PUT', 'PATCH'];

module.exports = (req) => {
  if (!methods.includes(req.method)) return null;

  return new Promise((resolve, reject) => {
    if (req.headers['content-type'] !== 'application/json') {
      reject('Incorrect content type. Must be application/json.');
      return;
    }
  });
};
