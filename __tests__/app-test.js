const request = require('supertest');
const { rm, mkdir } = require('fs/promises');
const app = require('../lib/app');
const SimpleDB = require('../lib/simple-db');

const rootDir = './storage/objects';

describe('coffee CRUD API', () => {
  beforeEach(() => {
    return rm(rootDir, { force: true, recursive: true }).then(() =>
      mkdir(rootDir, { recursive: true })
    );
  });

  afterAll(() => {
    return rm(rootDir, { force: true, recursive: true }).then(() =>
      mkdir(rootDir, { recursive: true })
    );
  });

  it('should create a new coffee and return it after POST', async () => {
    const coffee = { brand: 'Coava', name: 'Los Naranjos', origin: 'Mexico' };
    const response = await request(app).post('/coffees').send(coffee);

    expect(response.body).toEqual({ ...coffee, id: expect.any(String) });
  });

  it('gets a coffee database entry by id', async () => {
    const coffee = { brand: 'Coava', name: 'Los Naranjos', origin: 'Mexico' };
    const db = new SimpleDB(rootDir);
    await db.save(coffee);

    const response = await request(app).get(`/coffees/${coffee.id}`);

    expect(response.body).toEqual(coffee);
  });
});
