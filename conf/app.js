const express = require('express');
const app = express();
const consign = require('consign');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

consign({swd:'app', extensions:['.js']})
  .include('models')
  .then('apis')
  .then('routes')
  .then('docs')
  .into(app);

module.exports = app;