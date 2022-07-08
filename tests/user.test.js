const supertest = require('supertest');
const app = require('../server');
const mongo = require('../conf/mongo');
const userModel = require('mongoose').model('User');

const clearUserDB = () => {
  return userModel.deleteMany({});
};

describe('### User API Testing Set ###', () => {
  test('POST - a new valid user', async () => {
    const res = await supertest(app).post('/user').send({
      name: 'Wagner Perin',
      email: 'wagner@cmpaas.org',
      password: 'Abc@123456'
    });
    expect(res.status).toBe(201);
  });
  test('GET - UserList with Credentials', async () => {
    const res = await supertest(app).post('/auth').send({
      email: 'wagner@cmpaas.org',
      password: 'Abc@123456'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('x-access-token');
    
    const res2 = await supertest(app).get('/user').set('x-access-token', res.body['x-access-token']);
    expect(res2.status).toBe(200);
    expect(res2.body.length).toBe(3);
  });
  test('GET - UserList with Invalid Credentials', async () => {
    const res = await supertest(app).get('/user').set('x-access-token', 'invalid token');
    expect(res.status).toBe(401);
  });
  test('GET - UserList Without Credentials', async () => {
    const res = await supertest(app).get('/user');
    expect(res.status).toBe(401);
  });
});
afterAll(async () => {
  await clearUserDB();
  return await mongo.disconnect();
});