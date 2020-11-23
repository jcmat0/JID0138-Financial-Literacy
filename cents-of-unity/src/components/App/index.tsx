import React, { useState, useEffect } from 'react'
import './styles.css'
import HomePage from '../HomePage'
import Login from '../Login'
import Register from '../Register'
import Dashboard from '../Dashboard'
import Roster from '../Roster'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { CssBaseline, CircularProgress } from '@material-ui/core'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import firebase from '../firebase';
import CourseDashboard from '../CourseDashboard'
import ModuleEditPage from '../ModuleEditor'
import ModuleView from '../ModuleView'

const theme = createMuiTheme()

export default function App() {

	const [firebaseInitialized, setFirebaseInitialized] = useState(false)

	useEffect(() => {
		firebase.isInitialized().then(val => {
			// @ts-ignore
			setFirebaseInitialized(val)
		})
	})


	return firebaseInitialized !== false ? (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Switch>
					<Route exact path="/" component={HomePage} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/dashboard" component={Dashboard} />
					<Route path="/courseDashboard/:uid" render={(props) => <CourseDashboard {...props}/>}/>
					<Route path="/moduleEditor/:uid" render={(props) => <ModuleEditPage {...props}/>}/>
					<Route path="/module/:uid/:page" render={(props) => <ModuleView {...props}/>}/>
					<Route exact path="/Roster" component = {Roster}/>
				</Switch>
			</Router>
		</MuiThemeProvider>
	) : <div id="loader"><CircularProgress /></div>
}