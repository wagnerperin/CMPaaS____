const express = require('express');
const app = express();
const consign = require('consign');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

consign({cwd: 'app'})
  .include('models')
  .then('middlewares/schemas.js')
  .then('middlewares/schemaValidator.js')
  .then('apis')
  .then('routes')
  .then('docs')
  .into(app);

module.exports = app;