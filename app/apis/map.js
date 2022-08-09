module.exports = app => {
    const api = {};
    const mapModel = require('mongoose').model('Map');
    const mapVersionModel = require('mongoose').model('MapVersion');
  
    api.create = async (req, res) => {
      try{
        const newMapVersion = await mapVersionModel.create({content: req.body.initial_content});
        const newMap = await mapModel.create({...req.body, versions: [newMapVersion._id]});
        res.setHeader('Location', `/map/${newMap._id}`);
        res.sendStatus(201); 
      }catch(error) {
          res.status(400).json({error});
      } 
    };
  
    
  
    return api;
  }
  