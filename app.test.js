const supertest = require('supertest');
const app = require('./server');
const mongo = require('./conf/mongo');

test('POST a new user', async () => {
  const res = await supertest(app).post('/user').send({
    name: 'Wagner Perin',
    email: 'wagnerperin@gmail.com',
    password: '123456'
  });

  expect(res.status).toBe(201);
});

test('POST a new user with repeated email address', async () => {
  const res = await supertest(app).post('/user').send({
    name: 'Wagner Perin',
    email: 'wagnerperin@gmail.com',
    password: '123456'
  });

  expect(res.status).toBe(400);



});

afterAll((done) => {
  mongo.disconnect();
  done();
});