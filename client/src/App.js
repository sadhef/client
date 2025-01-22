import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import DashApp from './components/DashApp';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-black">
        <Navigation />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/admin-login" component={AdminLogin} />
          <PrivateRoute path="/admin" component={AdminPanel} adminOnly={true} />
          <PrivateRoute path="/dashapp" component={DashApp} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;