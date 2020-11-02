import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { withRouter } from 'react-router-dom'
import { Paper, Typography, Divider, FormControl, Input, InputLabel, Button } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import firebase from '../firebase'
import { Course } from '../Dashboard/courses'

const styles = theme => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
	paper: {
		marginTop: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
	},
	submit: {
		marginTop: theme.spacing.unit * 3,
	},
})


function Roster(props) {
	const [course, setCourse] = useState({} as Course)
	const [moduleName, setModuleName] = useState('')
	const [moduleType, setModuleType] = useState('lecture')
	const { classes } = props
	const { uid } = props.match.params
	
	useEffect(() => {
		firebase.getCourseData(uid).then(setCourse)
	}, [])
	
  return (
		<main className={classes.main}>
			<Paper className={classes.paper}>
				<Typography component="h1" variant="h4">
						{ course.name }
				</Typography>
			</Paper>
		</main>
  )

}

// @ts-ignore
export default withRouter(withStyles(styles)(Roster))