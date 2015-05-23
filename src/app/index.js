'use strict';

var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var AddUser = require('./components/add-member');
var Missing = require('./components/missing');
var Members = require('./components/members');

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
    <Route path="/members" handler={Members}/>
    <DefaultRoute handler={Missing}/>
  </Route>
);

Router.run(routes, Router.HashLocation, function(Root) {
  React.render(<Root/>, document.body);
});
