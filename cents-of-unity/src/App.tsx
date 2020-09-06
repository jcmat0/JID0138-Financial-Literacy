import React, { FC } from 'react'
import './App.css'
import Home from './home/Home'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Profile from './components/profile/Profile'

const App: FC = () => (
  <div className="App">
    <Router>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/profile' component={Profile}/>
      </Switch>
    </Router>
)

export default App