const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const token = new Schema({
    tokenId : { type : String},

    username : { type : String},

    used : { type : Boolean}
}, 
{timestamps : true});

module.exports = mongoose.model('Token', token);