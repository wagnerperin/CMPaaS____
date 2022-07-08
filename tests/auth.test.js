const supertest = require('supertest');
const app = require('../server');
const mongo = require('../conf/mongo');
const userModel = require('mongoose').model('User');
const {randomBytes, pbkdf2Sync} = require('crypto');

const salt = randomBytes(16).toString('hex');
const password = pbkdf2Sync('Abc@123456', salt, 1000, 64, 'sha512').toString('hex');

const users = [
  {
    name: 'Admin User',
    email: 'admin@cmpaas.org',
    userType: 'admin',
    password,
    salt
  },
  {
    name: 'User User',
    email: 'user@cmpaas.org',
    userType: 'user',
    password,
    salt
  }
];

const clearUserDB = () => {
  return userModel.deleteMany({});
};

const populateUserDB = () => {
  return userModel.insertMany(users);
};

describe('### Auth API Testing Set ###', () => {
  beforeAll(async () => {
    await clearUserDB();
    await populateUserDB();
  });

  test('POST - a valid authentication request', async () => {
    const res = await supertest(app).post('/auth').send({
      email: 'admin@cmpaas.org',
      password: 'Abc@123456'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('x-access-token');
  });
  test('POST - a invalid user', async () => {
    const res = await supertest(app).post('/auth').send({
      email: 'admin2@cmpaas.org',
      password: 'Abc@123456'
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('User not found');
  });
  test('POST - a invalid password', async () => {
    const res = await supertest(app).post('/auth').send({
      email: 'admin@cmpaas.org',
      password: 'Abc@12345'
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid password');
  });
});
afterAll(async () => {
  return await mongo.disconnect();
});