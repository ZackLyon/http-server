const { writeFile, readFile, readdir, rm } = require('fs/promises');
const { nanoid } = require('nanoid');
const path = require('path');

class SimpleDB {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  save(obj) {
    this.id = nanoid().slice(0, 5);
    const filename = `${this.id}.json`;
    const filePath = path.join(this.rootDir, filename);

    obj.id = this.id;
    const stringyObj = JSON.stringify(obj);
    return writeFile(filePath, stringyObj);
  }

  get(id) {
    const newPath = `${this.rootDir}/${id}.json`;
    return readFile(newPath, JSON)
      .then((result) => JSON.parse(result))
      .catch((err) => {
        if (err.code === 'ENOENT') {
          return null;
        }
        throw err;
      });
  }

  async getAll() {
    const fileArray = await readdir(this.rootDir);

    const promisesPromises = await Promise.all(
      fileArray.map((file) =>
        readFile(`${this.rootDir}/${file}`, JSON)
          .then((result) => JSON.parse(result))
          .catch((err) => {
            if (err.code === 'ENOENT') {
              return null;
            }
            throw err;
          })
      )
    );
    return promisesPromises;
  }

  async update(obj) {
    const newPath = `${this.rootDir}/${obj.id}.json`;
    return await writeFile(newPath, JSON.stringify(obj));
  }

  async delete(id) {
    const newPath = `${this.rootDir}/${id}.json`;
    return rm(newPath);
  }
}

module.exports = SimpleDB;
