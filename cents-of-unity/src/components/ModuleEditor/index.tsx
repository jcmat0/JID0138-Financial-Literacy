import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { withRouter } from 'react-router-dom'
import { WithStyles, Paper, Card, Typography, Divider, FormControl, Grid, Input, InputLabel, Button, List, ListItem, ListItemText } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import firebase from '../firebase'
import CenteredGrid from '../centeredGrid'
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
	card: {
		padding: theme.spacing.unit * 3,
		width: '100%',
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

export interface ModuleContent {
	type: string,
	path: string,
}

export interface Module {
	name: string,
	type: string,
	contents?: {
		[key: string]: ModuleContent
	},
}

export interface ModuleEditorProps {
	moduleID: string,
}

export interface Styles {
	palette?: any,
	classes: {
		[key: string]: string
	},
}

const emptyModule = {
	name: "",
	type: ""
}

class ModuleEditor extends React.Component {
	public props : Styles & ModuleEditorProps
	public state : {
		module: Module
		tempContent: ModuleContent | null
	}

	private moduleRef : any

	constructor(props) {
		super(props)
		this.props = props
		this.state = {module: emptyModule, tempContent: null}
		this.getModuleReference(props.moduleID)
	}

	async getModuleReference(id) {
		this.moduleRef = await firebase.getModuleRefByID(id)
		const module = await this.moduleRef.once('value').then(snapshot => snapshot.val())
		this.setState({module: module})

		this.moduleRef.on('child_added', this.propertyAdded)

		this.moduleRef.on('child_changed', this.propertyChanged)

		this.moduleRef.on('child_removed', this.propertyRemoved)
	}

	propertyAdded = propertyData => {
		const module = this.state.module
		module[propertyData.key] = propertyData.val()
		this.setState({module: module})
	}

	propertyChanged = propertyData => {
		const module = this.state.module
		module[propertyData.key] = propertyData.val()
		this.setState({module: module})
	}

	propertyRemoved = propertyData => {
		const module = this.state.module
		delete module[propertyData.key]
		this.setState({module: module})
	}

	renderContent(entry) {
		const contentKey = entry[0]
		const contentData = entry[1]

		return (
			<ListItem key={contentKey}>
				<ListItemText
					primary={contentData.type}
					secondary={contentData.path}
				/>
			</ListItem>
		)
	}

	handleTempType = (event) => {
		if (this.state.tempContent === null) return
		const tempContent = this.state.tempContent
		tempContent.type = event.target.value
		this.setState({tempContent: tempContent})
	}

	handleTempPath = (event) => {
		if (this.state.tempContent === null) return
		const tempContent = this.state.tempContent
		tempContent.path = event.target.value
		this.setState({tempContent: tempContent})
	}

	createContent = async () => {
		await firebase.createContent(this.props.moduleID, this.state.tempContent)
	}

	render() {
		if (this.state.module === null) {
			return "No module found"
		}


		if (this.state.module.contents === undefined || Object.keys(this.state.module.contents).length === 0) {
			console.log(this.state.tempContent)
			if (this.state.tempContent === null) {
				this.state.tempContent = {
					type: "",
					path: ""
				}
			}

			const disabled = this.state.tempContent.type === undefined || this.state.tempContent.type.length === 0
			              || this.state.tempContent.path === undefined || this.state.tempContent.path.length === 0

			return (
				<>
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="type">Content Type</InputLabel>
						<Input id="type" name="type" autoComplete="off" value={this.state.tempContent.type} onChange={this.handleTempType}  />
					</FormControl>

					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="path">Content Path</InputLabel>
						<Input id="path" name="path" autoComplete="off" value={this.state.tempContent.path} onChange={this.handleTempPath}  />
					</FormControl>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						disabled={disabled}
						color="primary"
						onClick={this.createContent}
						className={this.props.classes.submit}
					>
						Create Module Content
					</Button>
				</>
			)
		}

		return (
			<List>
				{Object.entries(this.state.module.contents).map(this.renderContent)}
			</List>
		)
	}
}

function ModuleEditPage(props) {
	const [module, setModule] = useState({} as Module)
	const { classes } = props
	const { uid } = props.match.params

	useEffect(() => {
		firebase.getModuleData(uid).then(setModule)
	}, [])

	return (
		<main className={classes.main}>
			<Paper className={classes.paper}>
				<Typography component="h1" variant="h4">
					{ module.name }
				</Typography>
				<Typography component="h1" variant="h5">
					{ module.type }
				</Typography>
			</Paper>
			<Paper className={classes.paper}>
				<Typography component="h1" variant="h5">
					Contents
				</Typography>
				<ModuleEditor moduleID={uid} classes={classes} />
			</Paper>
		</main>
	)
}

// @ts-ignore
export default withRouter(withStyles(styles)(ModuleEditPage))