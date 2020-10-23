import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { withRouter } from 'react-router-dom'
import { Paper, Typography, Divider, FormControl, Input, InputLabel, Button } from '@material-ui/core'
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


function CourseDashboard(props) {
	const [course, setCourse] = useState({} as Course)
	const [moduleName, setModuleName] = useState('')
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
				<Divider />
				<Typography component="h1" variant="h5">
						Modules
				</Typography>
				{/* <ModuleList /> */}
				<form className={classes.form} id='form3' onSubmit={e =>  e.preventDefault() }>
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="course">Module Name</InputLabel>
						<Input id="course" name="course" autoComplete="off" value={moduleName} onChange={e => setModuleName(e.target.value)}  />
					</FormControl>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						disabled={moduleName.length === 0}
						color="primary"
						onClick={createModule}
						className={classes.submit}>
						Create New Module
					</Button>
				</form>
			</Paper>
		</main>
	)
	async function createModule() {
		try {
			await firebase.createModule(moduleName, uid)
			setModuleName('')
		} catch(error) {
			alert(error.message)
		}
	}
}

// @ts-ignore
export default withRouter(withStyles(styles)(CourseDashboard))