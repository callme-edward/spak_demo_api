const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const user = new Schema({
    name : { type : String},

    password : { type : String},

    contact : { type : String},

    address : { type : Object},

    gender : { type : String},

    country : { type : String}
}, 
{timestamps : true});

module.exports = mongoose.model('User', user);