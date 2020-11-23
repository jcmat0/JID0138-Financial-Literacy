import React, { useState, useEffect } from 'react'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Collapse, FormControl, TextField, Button, Paper, Card, Typography, Divider, Grid, Input, InputLabel } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { EditRounded, DeleteRounded, ExpandLessRounded, CheckRounded } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import firebase from '../firebase'

interface User {
	name: string,
	email: string,
}

export function Roster(props) {
	const [users, setUsers] = useState([] as any[])
	const [newUserEmail, setNewUserEmail] = useState('')

	const classes = props.classes

	async function getUserInfo(roster) {
		return Promise.all(roster.map(firebase.getUserDataByID))
	}

	function loadRoster() {
		firebase.getCourseRoster(props.courseID).then(getUserInfo).then(setUsers)
	}

	async function addUser() {
		await firebase.addUserToRoster(props.courseID, newUserEmail)
		loadRoster()
	}

	async function removeUser(userID) {
		await firebase.removeUserFromRoster(props.courseID, userID)
		loadRoster()
	}

	function renderUser(user) {
		return (
			<ListItem>
				<ListItemText
					primary={user.name}
					secondary={user.email}
				/>
				<IconButton edge="end" color="secondary" onClick={() => removeUser(user.id)} id={user.id}>
					<DeleteRounded />
				</IconButton>
			</ListItem>
		)
	}

	useEffect(() => {
		loadRoster()
	}, [])

	return (
		<Paper className={classes.paper}>
			<Typography component="h1" variant="h5">
				Roster
			</Typography>
			<Card className={classes.card}>
				<List>
					{(users.length > 0) ? users.map(renderUser) : "No users"}
				</List>
			</Card>
			<FormControl margin="normal" required fullWidth>
				<InputLabel htmlFor="email">Student Email</InputLabel>
				<Input id="email" name="email" autoComplete="off" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)}  />
			</FormControl>
			<Button color="primary" variant="contained" onClick={addUser} className={classes.submit}>
				Add Student
			</Button>
		</Paper>
	)
}