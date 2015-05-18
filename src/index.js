var express = require('express');
var mongoose = require('mongoose');

var app = express();

var api = require('./api');

var PORT = process.env.PORT || 8000;
var MONGO_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/nplol-members';

mongoose.connect(MONGO_URI);

app.use('/api', api);
app.use('/', express.static('public'));


app.listen(PORT, function() {
  console.log('Server is running at port ' + PORT)
});
