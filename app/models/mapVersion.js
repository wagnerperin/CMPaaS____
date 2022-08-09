module.exports = app => {
    const mongoose = require('mongoose');
    
    //mapVersionSchema for persistence pourpose
    const mapVersionSchema = new mongoose.Schema({
        content: mongoose.Schema.Types.Mixed
    }, {timestamps: true});
  
    mongoose.model('MapVersion', mapVersionSchema);
  }
  