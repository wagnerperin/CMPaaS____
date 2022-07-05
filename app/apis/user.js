module.exports = app => {
  const api = {};
  const User = require('mongoose').model('User');

  api.create = async (req, res) => {
      try{
          await User.create(req.body);
          res.sendStatus(201); 
      }catch(error) {
          res.status(400).json({ error });
      } 
  };

  return api;
}