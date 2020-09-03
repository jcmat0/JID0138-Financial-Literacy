import React, { FC } from 'react'
import './App.css'
import Home from './home/Home'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

const App: FC = () => (
  <div className="App">
    <Router>
      <Switch>
        <Route exact path='/' component={Home}/>
      </Switch>
    </Router>
  </div>
)

export default App
