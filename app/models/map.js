module.exports = app => {
    const mongoose = require('mongoose');
    
    //mapSchema for persistence pourpose
    const mapSchema = new mongoose.Schema({
        title: String,
        description: String,
        question: String,
        keywords: [String],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        versions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MapVersion'
        }],
    }, {timestamps: true});
  
    mongoose.model('Map', mapSchema);
  }
  