'use strict';

var request = require('superagent');
var moment = require('moment');
var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

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
      var daysAgo = Math.abs(date.diff(today, 'days'));
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

var App = React.createClass({
  render () {
    return (
      <div>
        <RouteHandler/>
      </div>
    )
  }
});

var routes = (
  <Route handler={App}>
    <Route path="/add" handler={AddUser}/>
    <DefaultRoute handler={Missing}/>
  </Route>
);

Router.run(routes, Router.HashLocation, function(Root) {
  React.render(<Root/>, document.body);
});
