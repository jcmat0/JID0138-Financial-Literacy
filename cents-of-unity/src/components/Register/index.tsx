import { Avatar, Button, FormControl, Grid, Input, InputLabel, Paper, Typography } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import firebase from '../firebase'
import CenteredGrid from '../centeredGrid'

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
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit,
	},
	submit: {
		marginTop: theme.spacing.unit * 3,
	},
})

function Register(props) {
	const { classes } = props

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [phone, setPhone] = useState('')
	const [role, setRole] = useState('student')

	return (
		<main className={classes.main}>
			<Paper className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Register Account
				</Typography>
				<form className={classes.form} onSubmit={e =>  e.preventDefault() }>
					<Grid
						container
						direction="column"
						alignItems="stretch"
					>
						<Grid item>
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="name">Name</InputLabel>
								<Input id="name" name="name" autoComplete="off" autoFocus value={name} onChange={e => setName(e.target.value)} />
							</FormControl>
						</Grid>
						<Grid item>
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="email">Email Address</InputLabel>
								<Input id="email" name="email" autoComplete="off" value={email} onChange={e => setEmail(e.target.value)}  />
							</FormControl>
						</Grid>
						<Grid item>
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="password">Password</InputLabel>
								<Input name="password" type="password" id="password" autoComplete="off" value={password} onChange={e => setPassword(e.target.value)}  />
							</FormControl>
						</Grid>
						<Grid item>
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="phone">Your Phone Number</InputLabel>
								<Input name="phone" type="tel" id="phone" placeholder="(XXX)-XXX-XXXX" autoComplete="off" value={phone} onChange={e => setPhone(e.target.value)}  />
							</FormControl>
						</Grid>
						<CenteredGrid item>
							<FormControl margin="normal" required fullWidth>
								<ToggleButtonGroup
									id="select-role"
									value={role}
									exclusive
									onChange={(e, newValue) => setRole(newValue as string)}
								>
									<ToggleButton value={"student"}>Student</ToggleButton>
									<ToggleButton value={"professor"}>Professor</ToggleButton>
								</ToggleButtonGroup>
							</FormControl>
						</CenteredGrid>
					</Grid>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						onClick={onRegister}
						className={classes.submit}
					>
						Register
					</Button>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="secondary"
						component={Link}
						to="/login"
						className={classes.submit}
					>
						Go back to Login
					</Button>
				</form>
			</Paper>
		</main>
	)

	async function onRegister() {
		try {
			await firebase.register(name, email, password)
			await firebase.addPhone(phone)
			await firebase.addRole(role)
			props.history.replace('/dashboard')
		} catch(error) {
			alert(error.message)
		}
	}
}
// @ts-ignore
export default withRouter(withStyles(styles)(Register))
