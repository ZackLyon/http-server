const { rm, readdir, mkdir } = require('fs/promises');
const SimpleDB = require('../lib/simple-db');

describe('make folder', () => {
  const rootDir = './storage/objects';

  beforeEach(() => {
    //this is the fs version of rm -rf
    return rm(rootDir, { force: true, recursive: true }).then(() =>
      mkdir(rootDir, { recursive: true })
    );
  });

  afterAll(() => {
    //this is the fs version of rm -rf
    return rm(rootDir, { force: true, recursive: true }).then(() =>
      mkdir(rootDir, { recursive: true })
    );
  });

  it('should create a new objects directory in __tests__', () => {
    const expected = ['objects'];
    new SimpleDB(rootDir);

    return readdir('./storage').then((folders) =>
      expect(folders).toEqual(expect.arrayContaining(expected))
    );
  });

  it('.save should take in an object and add a unique id then make a JSON file with that id as the name, then .get should use id to get that file and parse it', () => {
    const newDB = new SimpleDB(rootDir);
    const newObj = { something: 'something' };
    return newDB
      .save(newObj)
      .then(() => newDB.get(newObj.id))
      .then((results) => expect(results).toEqual(newObj));
  });

  it('should return null if get(id) does not find a file', () => {
    const fakeId = 'looksFake';
    const newDB = new SimpleDB(rootDir);
    return newDB.get(fakeId).then((results) => expect(results).toEqual(null));
  });

  it('should return an array of objects from root directory in deserialized form', async () => {
    const expected = [
      { something: 'something', id: expect.any(String) },
      { somethingElse: 'somethingElse', id: expect.any(String) },
    ];

    const newDB = new SimpleDB(rootDir);

    return newDB
      .save({ somethingElse: 'somethingElse' })
      .then(() => newDB.save({ something: 'something' }))
      .then(() => newDB.getAll())
      .then((results) =>
        expect(expected).toEqual(expect.arrayContaining(results))
      );
  });

  it('should update an object from the db with given id', async () => {
    const newDB = new SimpleDB(rootDir);

    const expected = { some: 'thing', something: 'else' };
    await newDB.save(expected);

    expected.something = 'elseEntirely';
    await newDB.update(expected);

    const actual = await newDB.get(expected.id);
    expect(actual).toEqual(expected);
  });

  it('should delete an object from the db given the id', async () => {
    const newDB = new SimpleDB(rootDir);

    const something = { some: 'thing', something: 'else' };

    await newDB.save(something);
    await newDB.delete(something.id);
    const actual = await newDB.get(something.id);

    expect(actual).toBeNull();
  });
});
