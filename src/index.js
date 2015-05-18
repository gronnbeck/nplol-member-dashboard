var express = require('express');
var app = express();

var PORT = process.env.PORT || 8000;
var MONGO_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/nplol-members';



app.listen(PORT, function() {
  console.log('Server is running at port ' + PORT)
});
