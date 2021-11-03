const bodyParser = require('./body-parser');
const SimpleDB = require('./simple-db');

const db = new SimpleDB('./storage/objects');

const coffeeRouter = {
  async post(req, res) {
    const coffee = await bodyParser(req);
    await db.save(coffee);
    const savedCoffee = await db.get(coffee.id);

    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(savedCoffee));
  },

  async get(req, res) {
    const [, , id] = req.url.split('/');

    if (id) {
      const coffee = await db.get(id);
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(coffee));
    } else {
      const coffees = await db.getAll();
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(coffees));
    }
  },
};

module.exports = coffeeRouter;
