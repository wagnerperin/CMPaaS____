module.exports = app => {
  const api = {};
  const userModel = require('mongoose').model('User');

  api.create = async (req, res) => {
    try{
        await userModel.create(req.body);
        res.sendStatus(201); 
    }catch(error) {
        res.status(400).json({error});
    } 
  };

  api.list = async (req, res) => {
    try{
        const users = await userModel.find({});
        res.json(users);
    }catch(error) {
        res.status(500).json({error});
    } 
  };

  return api;
}
