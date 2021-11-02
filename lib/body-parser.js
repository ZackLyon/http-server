const methods = ['POST', 'PUT', 'PATCH'];

module.exports = (req) => {
  if (!methods.includes(req.method)) return null;
};
