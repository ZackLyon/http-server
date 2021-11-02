const bodyParser = require('../lib/body-parser.js');
const EventEmitter = require('events');

describe('body parser', () => {
  it('should return null if the method is not POST, PUT, or PATCH', async () => {
    const request = { method: 'GET' };
    const actual = await bodyParser(request);
    const expected = null;

    expect(actual).toEqual(expected);
  });

  it('should throw error if content type is not application/json', async () => {
    const request = {
      method: 'POST',
      headers: {
        'content-type': 'text/html',
      },
    };

    const expected = 'Incorrect content type. Must be application/json.';

    try {
      await bodyParser(request);
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });

  it('should return a deserialized body from req emitted events', async () => {
    const req = new EventEmitter();
    req.headers = {
      'content-type': 'application/json',
    };
    req.method = 'POST';
    const response = bodyParser(req);
    req.emit('acc', '{"some":');
    req.emit('acc', '"thing"}');
    req.emit('end');

    const responseBody = await response;
    expect(responseBody).toEqual({ some: 'thing' });
  });

  it('should throw "Bad JSON during parse" if deserialization has a failure', async () => {
    const req = new EventEmitter();
    req.headers = {
      'content-type': 'application/json',
    };
    req.method = 'POST';
    const response = bodyParser(req);
    req.emit('acc', '{ garbage }');
    req.emit('end');

    try {
      await response;
    } catch (err) {
      expect(err).toEqual('Bad JSON during parse');
    }
  });
});
