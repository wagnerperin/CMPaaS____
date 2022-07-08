const supertest = require('supertest');
const app = require('../server');
const mongo = require('../conf/mongo');


describe('### Docs Available ###', () => {
  test('GET - docs', async () => {
    const res = await supertest(app).get('/');
    expect(res.status).toBe(200);
  });
});
afterAll(async () => {
  return await mongo.disconnect();
});