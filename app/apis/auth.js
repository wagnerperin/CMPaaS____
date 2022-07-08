module.exports = app => {
  const jwt = require('jsonwebtoken');
  const userModel = require('mongoose').model('User');
  const api = {};

  api.authenticate = async (req, res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email}).select('+password +salt');
    if(!user) {
      res.status(401).json({error: 'User not found'});
    }else{
      const isValid = await user.isValidPassword(password);
      if(!isValid){
        res.status(401).json({error: 'Invalid password'});
      }else{
        const token = jwt.sign({id: user._id}, process.env.JWT_AUTH_SECRET);
        res.json({'x-access-token': token});
      }
    }
  };

  return api;
}
