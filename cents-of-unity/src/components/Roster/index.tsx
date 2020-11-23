import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { withRouter } from 'react-router-dom'
import { Paper, Typography, Divider, FormControl, Input, InputLabel, Button, Grid } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import firebase from '../firebase'
import { Course } from '../Dashboard/courses'
import { AddAlarmOutlined } from '@material-ui/icons'

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
	const [studentEmail, setStudentEmail] = useState('')

	useEffect(() => {
		firebase.getCourseData(uid).then(setCourse)
	}, [])

	const studentList : Promise<any>[] = []

	const test = [1, 2]

	
  return (
		<main className={classes.main}>
			<Paper className={classes.paper}>
				<Typography component="h1" variant="h4">
						Course Roster
				</Typography>
			</Paper>
			<Grid item>
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="email">Student Email</InputLabel>
							<Input id="email" name="email" autoComplete="off" autoFocus value={studentEmail} onChange={e => setStudentEmail(e.target.value)}/>
						</FormControl>
			</Grid>
			<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						onClick={onAddStudent}
						className={classes.submit}>
						Add Student to Course
          	</Button>
				<ul>{test}</ul>
  				<ul>{studentList}</ul>
		</main>
  )

async function onAddStudent() {
	studentList.push(firebase.searchStudentByEmail(studentEmail))
}

}

// @ts-ignore
export default withRouter(withStyles(styles)(Roster))