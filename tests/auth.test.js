const supertest = require('supertest');
const app = require('../server');
const mongo = require('../conf/mongo');
const userModel = require('mongoose').model('User');

const clearUserDB = () => {
  return userModel.deleteMany({});
};

const populateUserDB = () => {
  return userModel.create({
    name: 'Wagner Perin',
    email: 'wagnerperin@gmail.com',
    password: 'Abc@123456'

  });
};

describe('Auth API tests', () => {
  beforeAll(async () => {
    await clearUserDB();
    await populateUserDB();
  });
  afterAll(async () => {
    await clearUserDB();
  });

  test('POST - a valid authentication request', async () => {
    const res = await supertest(app).post('/auth').send({
      email: 'wagnerperin@gmail.com',
      password: 'Abc@123456'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('x-access-token');
  });
  test('POST - invalid user', async () => {
    const res = await supertest(app).post('/auth').send({
      email: 'wagnerperin2@gmail.com',
      password: 'Abc@123456'
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('User not found');
  });
  test('POST - invalid password', async () => {
    const res = await supertest(app).post('/auth').send({
      email: 'wagnerperin@gmail.com',
      password: 'Abc@12345'
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid password');
  });
});
afterAll(async () => {
  return await mongo.disconnect();
});