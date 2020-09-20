import React, { Fragment } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Home from './components/home';
import Projects from './components/projects';
import Nav from './components/nav';
import Detail from './components/detail';
import Add from './components/add';
import Promo from './components/promo';
import Main from "./components/main";
import Edit from "./components/edit";
import Project from "./components/project";
import Queue from "./components/queue/queue";

class App extends React.Component {
  render() {
    return (
      <Fragment>
        <Nav />
        <Switch>
            <Route exact path='/' component={Main} />
            <Route path='/add' component={Add} />
            <Route path='/projects' component={Projects} />
            <Route path='/detail/:id' component={Detail} />
            <Route path='/promo' component={Promo} />
            <Route path='/edit/:id' component={Edit} />
            <Route path='/project/:id' component={Project} />
            <Route path='/queue' component={Queue} />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
