const supertest = require('supertest');
const app = require('../server');
const mongo = require('../conf/mongo');
const userModel = require('mongoose').model('User');

const clearUserDB = () => {
  return userModel.deleteMany({});
};

describe('Testing User API', () => {
  beforeAll(async () => {
    await clearUserDB();
  });

  test('POST - a new valid user', async () => {
    const res = await supertest(app).post('/user').send({
      name: 'Wagner Perin',
      email: 'wagnerperin@gmail.com',
      password: '123456'
    });
    expect(res.status).toBe(201);
  });

  test('POST - try repeated data', async () => {
    const res = await supertest(app).post('/user').send({
      name: 'Wagner Perin',
      email: 'wagnerperin@gmail.com',
      password: '123456'
    });

    expect(res.status).toBe(400);
  });

  test('GET - get all users', async () => {
    const res = await supertest(app).get('/user');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });
});
afterAll(async () => {
  return await mongo.disconnect();
});