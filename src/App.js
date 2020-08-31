import React, { Fragment } from 'react';
import './App.css';
import Pager from 'react-pager';
import Loader from './components/loader';
import { Switch, Route } from 'react-router-dom';
import Home from './components/home';
import Projects from './components/projects';
import Nav from './components/nav';
import Detail from './components/detail';
import Add from './components/add';
import Promo from './components/promo';

class App extends React.Component {
  render() {
    return (
      <Fragment>
        <Nav />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/add' component={Add} />
          <Route path='/projects' component={Projects} />
          <Route path='/detail/:id' component={Detail} />
          <Route path='/promo' component={Promo} />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
