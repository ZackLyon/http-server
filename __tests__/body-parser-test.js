const bodyParser = require('../lib/body-parser.js');

describe('body parser', () => {
  it('should return null if the method is not POST, PUT, or PATCH', async () => {
    const request = { method: 'GET' };
    const actual = bodyParser(request);
    const expected = null;
    expect(actual).toEqual(expected);
  });
});
