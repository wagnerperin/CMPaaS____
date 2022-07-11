module.exports = app => {
  const env = require('../../conf/env.js');
  const jwt = require('jsonwebtoken');
  const userModel = require('mongoose').model('User');
  const api = {};

  const loadToken = (req) => {
    req.isAuthenticated = () => req.user ? true : false;

    const token = req.headers['x-access-token'];
    
    if(token){ 
      jwt.verify(token, env.JWT_AUTH_SECRET, (_, decoded) => {
        req.user = decoded; 
      });  
    }
  };

  api.authenticate = async (req, res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email}).select('+password +salt +userType');

    if(!user) {
      res.status(401).json({error: 'User not found'});
    }else{
      const isValid = await user.isValidPassword(password);
      if(!isValid){
        res.status(401).json({error: 'Invalid password'});
      }else{
        const token = jwt.sign({id: user._id}, env.JWT_AUTH_SECRET, {expiresIn: '1d'});
        res.json({'x-access-token': token});
      }
    }
  };

  api.authenticationRequired = async (req, res, next) => {
    loadToken(req);

    if(!req.isAuthenticated()) res.status(401).json({error: 'Authentication required'});
    else next();
  };

  return api;
}
