const coffeeRouter = require('./coffees');

const routes = {
  coffees: coffeeRouter,
};

module.exports = async (req, res) => {
  const [, routeName] = req.url.split('/');
  const route = routes[routeName];

  if (route) {
    try {
      const routeHandler = route[req.method.toLowerCase()];
      await routeHandler(req, res);
    } catch (err) {
      res.statusCode = 500;
      res.end(err.message);
    }
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
};
