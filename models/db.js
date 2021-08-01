const mongoose = require('mongoose');
const myEnv = require('dotenv').config();

const options = {
  poolSize: 20,
  useNewUrlParser: true,
  useUnifiedTopology : true
}

mongoose.connect(myEnv.parsed.DB_URL, options);

var db = mongoose.connection;

// CONNECTION EVENTS
db.on('connected', function() {
  console.log("db connected");
});

db.on('error', function(err) {
  setTimeout(function(){
    mongoose.connect(myEnv.parsed.DB_URL, options);  
  }, 5000)
});

db.on('disconnected', function() {
  console.log("db disconnected");
});
