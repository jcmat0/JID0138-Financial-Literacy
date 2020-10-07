import { Avatar, Button, CircularProgress, FormControl, Input, InputLabel, Paper, Typography } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import firebase from '../firebase'

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

function Dashboard(props: { history?: any; classes?: any }) {
	const { classes } = props

	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')
	const [role, setRole] = useState('')
	const [newEmail, setNewEmail] = useState('')
	const [newPhone, setNewPhone] = useState('')

	useEffect(() => {
		if (firebase.getCurrentUsername()) {
			firebase.getCurrentUserPhone().then(setPhone)
			firebase.getCurrentUserEmail().then(setEmail)
			firebase.getCurrentUserRole().then(setRole)
		}
	}, [])

	if(!firebase.getCurrentUsername()) {
		// not logged in
		alert('Please login first')
		props.history.replace('/login')
		return null
	}

	return (
		<main className={classes.main}>
			<Paper className={classes.paper}>
				<Avatar className={classes.avatar}>
					<VerifiedUserOutlined />
				</Avatar>
				<Typography component="h1" variant="h5">
					Hello { firebase.getCurrentUsername() }
				</Typography>
				<Typography component="h1" variant="h5">
					Your phone: {phone ? `${phone}` : <CircularProgress size={20} />}
				</Typography>
				<Typography component="h1" variant="h5">
					Your email: {email ? `${email}` : <CircularProgress size={20} />}
				</Typography>
				<Typography component="h1" variant="h5">
					Your role: {role ? `${role}` : <CircularProgress size={20} />}
				</Typography>
				<form className={classes.form} onSubmit={e =>  e.preventDefault() }>
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="email">Change Email Address</InputLabel>
						<Input id="email" name="email" placeholder={email} autoComplete="off" value={newEmail} onChange={e => setNewEmail(e.target.value)}  />
					</FormControl>

					<Button
						type="submit"
						fullWidth
						disabled={newEmail.length === 0}
						variant="contained"
						color="primary"
						onClick={changeEmail}
						className={classes.submit}>
						Change Email
          			</Button>

				</form>

				<form className={classes.form} id='form2' onSubmit={e =>  e.preventDefault() }>
				<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="tel">Change Phone </InputLabel>
						<Input id="phone" name="phone" placeholder={phone} autoComplete="off" value={newPhone} onChange={e => setNewPhone(e.target.value)}  />
					</FormControl>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						disabled={newPhone.length === 0}
						color="primary"
						onClick={changePhone}
						className={classes.submit}>
						Change Phone
          			</Button>
				</form>
				
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="secondary"
					onClick={logout}
					className={classes.submit}>
					Logout
          		</Button>
			</Paper>
		</main>
	)
	
	async function changeEmail() {
		try {
			await firebase.updateUserEmail(newEmail)
		} catch(error) {
			alert(error.message)
		}
	}
	async function changePhone() {
		try {
			await firebase.updateUserPhone(newPhone)
		} catch(error) {
			alert(error.message)
		}
	}

	async function logout() {
		await firebase.logout()
		props.history.push('/')
	}
}

// @ts-ignore
export default withRouter(withStyles(styles)(Dashboard))