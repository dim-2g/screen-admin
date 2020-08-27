import React, { Fragment } from 'react';
import './App.css';
import Pager from 'react-pager';
import Loader from './components/loader';
import { Switch, Route } from 'react-router-dom';
import Home from './components/home';
import Projects from './components/projects';
import Nav from './components/nav';

class App extends React.Component {
  render() {
    return (
      <Fragment>
        <Nav />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/projects' component={Projects} />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
