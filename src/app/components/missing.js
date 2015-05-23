var React = require('react');
var request = require('superagent');
var moment = require('moment');

var Missing = React.createClass({
  getInitialState() {
    return {
      missing: []
    }
  },
  componentDidMount() {
    request
    .get('/api/missing?since=2')
    .end(function(err, res){
      if (err) throw new Error(err);
      var missing = JSON.parse(res.text);
      this.setState({
        missing: missing
      });
    }.bind(this));
  },
  render() {
    var users = this.state.missing.map(function(missing) {
      var date = moment(missing.lastSeen);
      var today = moment();
      var daysAgo = today.diff(date, 'days');
      return <div>
        <div>{missing.username}</div>
        <div>Has been missing for {daysAgo} days</div>
      </div>
    });
    return (
      <div>
        <h1>Missing users</h1>
        {users}
      </div>
    )
  }
});

module.exports = Missing;
