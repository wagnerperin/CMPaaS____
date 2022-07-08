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
      password: 'Abc@123456'
    });
    expect(res.status).toBe(201);
  });

  test('POST - try repeated data', async () => {
    const res = await supertest(app).post('/user').send({
      name: 'Wagner Perin',
      email: 'wagnerperin@gmail.com',
      password: 'Abc@123456'
    });

    expect(res.status).toBe(400);
  });

  test('GET - get all users', async () => {
    const res = await supertest(app).get('/user');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test('POST - try to send invalid fields', async () => {
    const res = await supertest(app).post('/user').send({
      name: 'Priscilla Demoner',
      email: 'priscillanara@hotmail.com',
      password: 'Abc@123456',
      userType: 'admin'
    });
    expect(res.status).toBe(201);
    const res2 = await supertest(app).get('/user');
    expect(res2.status).toBe(200);
    expect(Array.isArray(res2.body)).toBe(true);
    expect(res2.body.length).toBe(2);
    expect(res2.body[1].userType).toBe('user');
  });
  test('POST - try to send invalid content', async () => {
    const res = await supertest(app).post('/user').send({
      name: 'Priscilla Demoner',
      email: 'priscillanara',
      password: '23432',
      userType: 'admin'
    });
    expect(res.status).toBe(400);
  });
});
describe('Testing User API', () => {
  test('GET - check if docs is available', async () => {
    const res = await supertest(app).get('/');
    expect(res.status).toBe(200);
  });
});
afterAll(async () => {
  return await mongo.disconnect();
});