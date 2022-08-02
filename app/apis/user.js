module.exports = app => {
  const api = {};
  const userModel = require('mongoose').model('User');

  api.create = async (req, res) => {
    try{
        let user = await userModel.create(req.body);
        res.setHeader('Location', `/users/${user._id}`);
        res.sendStatus(201); 
    }catch(error) {
        res.status(400).json({error});
    } 
  };

  api.list = async (req, res) => {
    try{
        let {limit = 10, page = 1, q} = req.query;
        let query = {};

        if(q){
          query = {
            $or: [{'name': {'$regex': q, '$options': 'i'}},
                  {'email': {'$regex': q,'$options': 'i'}}
            ]
          }
        }
        
        const users = await userModel.find(query).limit(parseInt(limit)).skip(parseInt(limit * (page - 1))).exec();
        res.json(users);
    }catch(error) {
        res.status(500).json({error});
    } 
  };

  return api;
}
