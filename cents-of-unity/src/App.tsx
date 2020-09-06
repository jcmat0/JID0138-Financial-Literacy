import React, { FC } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import Home from './home/Home'

const App: FC = () => (
  <div className="App">
    <Router>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/profile' component={Home} />
      </Switch>
    </Router>
  </div>
)

export default App
