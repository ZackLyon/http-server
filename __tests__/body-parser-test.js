const bodyParser = require('../lib/body-parser.js');

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
});
