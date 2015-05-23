var React = require('react');
var request = require('superagent');

var addUser = function(username, err, ok) {
  request
    .post('/api/members')
    .set('content-type', 'application/json')
    .send({ username: username })
    .end(function(error, res) {
      if (error) return err(error)
      else {
        var data = JSON.parse(res.text);
        if (data.success) return ok();
        else return err({error: 'Unsuccessful'});
      }
    });
}

var AddUser = React.createClass({
  getInitialState() {
    return {
      value: ''
    }
  },
  handleClick() {
    addUser(this.state.value,
      function err() {
        this.setState({
          error: 'Could not add user'
        })
      }.bind(this),
      function ok() {
        this.setState({
          ok: 'User ' + this.state.value + ' has been added '
        })
      }.bind(this))
  },
  handleChange (event) {
    this.setState({value: event.target.value});
  },
  render() {
    var value = this.state.value;
    var ok = (this.state.ok && !this.state.err) ? <div>{this.state.ok}</div> : null;
    var err = this.state.err ? <div>{this.state.err}</div> : null;
    return (
      <div>
        {ok}
        {err}
        <input type="text" value={value} onChange={this.handleChange} placeholder="username" />
        <button onClick={this.handleClick}>Submit</button>
      </div>
    );
  }
});

module.exports = AddUser;
