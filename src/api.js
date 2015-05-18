var express = require('express');
var bodyParser = require('body-parser');
var request = require('superagent');
var mongoose = require('mongoose');
var _ = require('lodash');
var moment = require('moment');

var NPLOL_ATTENDANCE_URL = process.env.NPLOL_ATTENDANCE_URL;

var Member = mongoose.model('Member', {
  username: String
});

var Event = mongoose.model('Event', {
  type: String,
  ts: {
    type: Date,
    default: Date.now
  },
  data: Object
});

var app = express();
app.use(bodyParser.json());

var parseDays = function(days) {
  var today = moment();
  // Note: today has also mutated;
  var past = today.add(-1 * days, 'day');
  return past;
}

app.get('/missing', function(req, res) {
  var sinceOfDays = parseInt(req.query.since || 7);
  var sinceOf = parseDays(sinceOfDays);

  request
  .get(NPLOL_ATTENDANCE_URL)
  .end(function(err, result) {
    if (err) throw new Error('Something happened');
    else {
      var data = JSON.parse(result.text);
      Member.find().exec(function(err, docs) {
        if (err) throw new Error(err);
        else {
          var usernames = _.map(docs, function(doc) {
            return doc.username;
          });

          var inactives = _.chain(data).filter(function(activity) {
            return _.contains(usernames, activity.username);
          }).filter(function(activity) {
            var lastSeen = moment(activity.lastSeen);
            return lastSeen > sinceOf;
          }).value();

          return res.send(inactives);
        }
      });

    }
  })
});

app.get('/members', function(req, res) {
  Member.find().exec(function(err, docs) {
    if (err) throw new Error(err);
    else return res.send(docs);
  });
});

app.post('/members', function(req, res) {
  var username = req.body.username;

  if (username == null) {
    return res.status(500).send({
      success: false,
      error: 'Parameter <username> is missing'
    });
  }

  var event = new Event({
    type: 'MemberJoined',
    data: {
      username: username
    }
  });

  var member = new Member({
    username: username
  });

  event.save(function(err) {
    if (err) throw new Error('Could not save MemberJoined event');
    else {
      member.save(function(err) {
        // Since memberEvent was saved the data is still available
        // but we fail hard for now
        if (err) throw new Error('Could not save member after event was saved');
        else return res.send({ success: true, username: username });
      });
    }
  })


});


module.exports = app;
