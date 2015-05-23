var React = require('react');
var request = require('superagent');

var MemberList = React.createClass({
  getInitialState() {
    return {
      members: null
    }
  },

  componentDidMount() {
    request
      .get('/api/members')
      .set('content-type', 'application/json')
      .end(function(err, res) {
        if (err) throw new Error('API failed /api/members');
        else {
          var members = JSON.parse(res.text);
          this.setState({
            members: members
          });
        }
      }.bind(this));
  },

  render() {
    var members = this.state.members;
    if (members === null || members === undefined) {
      return <div>Loading members please wait</div>
    }
    else if (members.length === 0) {
      return <div>No members added</div>
    }
    else {
      var membersMarkup = members.map(function(member) {
        return <li>{member.username}</li>
      });

      return (
        <ul>
          {membersMarkup}
        </ul>
      )
    }
  }
});

var Members = React.createClass({
    render() {
      return (
        <div>
          <h1>Members</h1>
          <MemberList/>
        </div>
      )
    }
})

module.exports = Members;
