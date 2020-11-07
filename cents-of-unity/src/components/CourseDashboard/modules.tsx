import React, { useEffect } from 'react'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Collapse, FormControl, TextField, Button } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { EditRounded, DeleteRounded, ExpandLessRounded, CheckRounded } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import firebase from '../firebase'

type propType = {
	courseID: string
}
export class ModuleList extends React.Component<propType> {
	private moduleRef : any
	state = {
		modules: {}
	}
	componentDidMount() {
		this.getModuleReference()
	}

	async getModuleReference() {
		const {courseID} = this.props
		console.log("Setting up modules listeners")
		this.moduleRef = await firebase.getCourseModules(courseID)
		console.log("refs?", this.moduleRef)
		this.moduleRef.on('child_added', this.moduleAdded)

		this.moduleRef.on('child_changed', this.moduleChanged)

		this.moduleRef.on('child_removed', this.moduleRemoved)
	}

	moduleAdded = async moduleData => {
		console.log("MODULE ADDED CALLED")
		const newModules = {
			[moduleData.key]: await firebase.getModuleRefByID(moduleData.key).then(reference => {
				return reference.once('value').then(snapshot => snapshot.val())
			})
		}

		Object.assign(newModules, this.state.modules)

		this.setState({
			modules: newModules
		})
	}

	moduleChanged = async moduleData => {
		console.log("MODULE CHANGED CALLED")
		const newModules = {
			[moduleData.key]: await firebase.getModuleRefByID(moduleData.key).then(reference => {
				return reference.once('value').then(snapshot => snapshot.val())
			})
		}

		Object.assign(newModules, this.state.modules)

		this.setState({
			modules: newModules
		})
	}

	moduleRemoved = async moduleData => {
		console.log("MODULE REMOVED CALLED")
		const newModules = Object.assign({}, this.state.modules)

		delete newModules[moduleData.key]

		this.setState({
			modules: newModules
		})
	}

	renderModule = data => {

		var renderOut = (
			<ModuleListItem key={data[0]} moduleID={data[0]} module={data[1]}/>
		)

		return renderOut
	}

	deleteModule = async entry => {
		const key = entry[0]
		const course = entry[1]
		const {courseID} = this.props
		console.log("Deleting module", key, course)
		try {
			await Promise.all([(await firebase.getModuleRefByID(key)).remove(), (await firebase.getModuleExistenceInCourseIDRef(courseID,key)).remove()])
		} catch(error) {
			console.log(error.message)
		}
	}

	render() {
		console.log("Rendering module list", this.state)

		const modules = Object.entries(this.state.modules)

		return (
			<List>
				{modules.length > 0 ? modules.map(this.renderModule) : (
					<ListItem key="noModules">
						<ListItemText
							secondary="No modules available"
						/>
					</ListItem>
				)}
			</List>
		)
	}
}

export interface Module {
	name: string,
	type: string,
}

interface ModuleDataProp {
	moduleID: string,
	module: Module,
}

const moduleKeys = {"name": true, "type": true}

class ModuleListItem extends React.Component<ModuleDataProp> {
	public moduleID : string
	public state : any

	private moduleRef : any

	constructor(props) {
		super(props)
		this.moduleID = props.moduleID
		this.state = {
			open: false,
			name: props.module.name,
			nameInput: props.module.name,
			type: props.module.type,
			typeInput: props.module.type,
			courseID: props.module.courseID,
		}

		this.getModuleReference()
	}

	async getModuleReference() {
		console.log("Setting up module listeners")
		this.moduleRef = await firebase.getModuleRefByID(this.moduleID)

		this.moduleRef.on('child_added', this.propertyAdded)

		this.moduleRef.on('child_changed', this.propertyChanged)

		this.moduleRef.on('child_removed', this.propertyRemoved)
	}

	propertyAdded = propertyData => {
		console.log(propertyData.key, moduleKeys, propertyData.val(), propertyData.key in moduleKeys)
		if (propertyData.key in moduleKeys) {
			this.setState({
				[propertyData.key]: propertyData.val()
			})
		}
	}

	propertyChanged = propertyData => {
		console.log(propertyData.key, moduleKeys, propertyData.key in moduleKeys)
		if (propertyData.key in moduleKeys) {
			this.setState({
				[propertyData.key]: propertyData.val()
			})
		}
	}

	propertyRemoved = propertyData => {
		console.log(propertyData.key, moduleKeys, propertyData.key in moduleKeys)
		if (propertyData.key in moduleKeys) {
			this.setState({
				[propertyData.key]: propertyData.val()
			})
		}
	}

	expand = () => {
		this.setState({open: !this.state.open})
	}

	deleteModule = async () => {
		try {
			await Promise.all([(await firebase.getModuleRefByID(this.moduleID)).remove(), (await firebase.getModuleExistenceInCourseIDRef(this.state.courseID,this.moduleID)).remove()])
		} catch(error) {
			console.log(error.message)
		}
	}

	handleModuleName = event => {
		this.setState({nameInput: event.target.value})
	}

	handleModuleType = (event, value) => {
		console.log(value)
		this.setState({typeInput: value})
	}

	submitModuleName = async event => {
		event.preventDefault()
		await (await firebase.getModuleRefByID(this.moduleID)).update({
			name: this.state.nameInput
		})
	}

	submitModuleType = async event => {
		event.preventDefault()
		await (await firebase.getModuleRefByID(this.moduleID)).update({
			type: this.state.typeInput
		})
	}

	getInnerControls = () => {
		return (
			<ListItemSecondaryAction>
				<IconButton edge="end" onClick={() => this.expand()}>
					{this.state.open ? <ExpandLessRounded /> : <EditRounded />}
				</IconButton>
				<IconButton edge="end" color="secondary" onClick={() => this.deleteModule()}>
					<DeleteRounded />
				</IconButton>
			</ListItemSecondaryAction>
		)
	}

	getOuterControls = () => {
		return (
			<Collapse in={this.state.open} timeout="auto" unmountOnExit>
				<List disablePadding dense>
					<ListItem key={this.moduleID + "_name_control"} dense>
						<form onSubmit={this.submitModuleName}>
							<TextField
								required
								id={this.moduleID+"_name"}
								defaultValue={this.state.nameInput}
								onChange={this.handleModuleName}
								label="Edit Module Name"
								variant="filled"
								autoComplete="off"
							/>
							<ListItemSecondaryAction>
								<IconButton type="submit" edge="end" disabled={this.state.nameInput === ""}>
									<CheckRounded />
								</IconButton>
							</ListItemSecondaryAction>
						</form>
					</ListItem>
					<ListItem key={this.moduleID + "_description"} dense>
						<form onSubmit={this.submitModuleType}>
							<FormControl margin="normal" required fullWidth>
								<ToggleButtonGroup
									id="select-module-type"
									value={this.state.typeInput}
									exclusive
									onChange={this.handleModuleType}
								>
									<ToggleButton value={"Lecture"}>Lecture</ToggleButton>
									<ToggleButton value={"Simulation"}>Simulation</ToggleButton>
								</ToggleButtonGroup>
							</FormControl>
							<ListItemSecondaryAction>
								<IconButton type="submit" edge="end">
									<CheckRounded />
								</IconButton>
							</ListItemSecondaryAction>
						</form>
					</ListItem>
					<ListItem key={this.moduleID + "_edit_content_button"}>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							component={Link}
							to={'/moduleEditor/' + this.moduleID} // change to link to the module edit page
						>
							Edit Content
						</Button>
					</ListItem>
				</List>
			</Collapse>
		)
	}

	render() {
		return (
			<>
				<ListItem key={this.moduleID}>
					<ListItemText
						primary={this.state.name || "Invalid module"}
						secondary={this.state.type || "No type"}
					/>
					{this.getInnerControls()}
				</ListItem>
				{this.getOuterControls()}
			</>
		)
	}
}