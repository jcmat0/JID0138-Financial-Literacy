import React, { useEffect } from 'react'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Collapse, FormControl, TextField, Button } from '@material-ui/core'
import { EditRounded, DeleteRounded, ExpandLessRounded, CheckRounded } from '@material-ui/icons'
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

	moduleAdded = async courseData => {
		console.log("MODULE ADDED CALLED")
		const newModules = {
			[courseData.key]: await firebase.getModuleRefByID(courseData.key).then(reference => {
				return reference.once('value').then(snapshot => snapshot.val())
			})
		}

		Object.assign(newModules, this.state.modules)

		this.setState({
			modules: newModules
		})
	}

	moduleChanged = async courseData => {
		console.log("MODULE CHANGED CALLED")
		const newModules = {
			[courseData.key]: await firebase.getModuleRefByID(courseData.key).then(reference => {
				return reference.once('value').then(snapshot => snapshot.val())
			})
		}

		Object.assign(newModules, this.state.modules)

		this.setState({
			modules: newModules
		})
	}

	moduleRemoved = async courseData => {
		console.log("MODULE REMOVED CALLED")
		const newModules = Object.assign({}, this.state.modules)

		delete newModules[courseData.key]

		this.setState({
			modules: newModules
		})
	}

	// renderModule = entry => {
		// const module = entry[1]
		// const renderOut = (
		// 	<ListItem key={module.name} button>
		// 		<ListItemText
		// 			primary={module.name || "Invalid module"}
		// 			secondary={module.type || "No description"}
		// 		/>
		// 		{(module.createdBy === firebase.auth.currentUser?.uid) ?
		// 			(
		// 				<ListItemSecondaryAction>
		// 					<IconButton edge="end">
		// 						<EditRounded />
		// 					</IconButton>
		// 					<IconButton edge="end" color="secondary" onClick={() => this.deleteModule(entry)}>
		// 						<DeleteRounded />
		// 					</IconButton>
		// 				</ListItemSecondaryAction>
		// 				)
		// 			: ""
		// 		}
		// 	</ListItem>
		// )

		// console.log(renderOut)

		// return renderOut
		renderModule = data => {

			var renderOut = (
				<ModuleListItem key={data[0]} moduleID={data[0]} module={data[1]}/>
			)
	
			return renderOut
		}
	// }

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
			courseID: props.module.courseID,
			name: props.module.name,
			nameInput: props.module.name,
			type: props.module.type,
		}

		this.getModuleReference()
	}

	async getModuleReference() {
		console.log("Setting up modules listeners")
		this.moduleRef = await firebase.getCourseModules(this.state.courseID)
		console.log("refs?", this.moduleRef)
		this.moduleRef.on('child_added', this.propertyAdded)

		this.moduleRef.on('child_changed', this.propertyChanged)

		this.moduleRef.on('child_removed', this.propertyRemoved)
	}

	propertyAdded = propertyData => {
		console.log("PROPERTY ADDED CALLED")
		console.log(propertyData.key, moduleKeys, propertyData.val(), propertyData.key in moduleKeys)
		if (propertyData.key in moduleKeys) {
			this.setState({
				[propertyData.key]: propertyData.val()
			})
		}
	}

	propertyChanged = propertyData => {
		console.log("PROPERTY CHANGED CALLED")
		console.log(propertyData.key, moduleKeys, propertyData.key in moduleKeys)
		if (propertyData.key in moduleKeys) {
			this.setState({
				[propertyData.key]: propertyData.val()
			})
		}
	}

	propertyRemoved = propertyData => {
		console.log("PROPERTY REMOVED CALLED")
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

	handleCourseDescription = event => {
		this.setState({descriptionInput: event.target.value})
	}

	submitModuleName = async event => {
		event.preventDefault()
		await (await firebase.getModuleRefByID(this.moduleID)).update({
			name: this.state.nameInput
		})
	}

	submitCourseDescription = async event => {
		event.preventDefault()
		await (await firebase.getCourseRefByID(this.moduleID)).update({
			description: this.state.descriptionInput
		})
	}

	getInnerControls = () => {
		return (<ListItem key={this.state.name} button>
			{
				(
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
		</ListItem>
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
							<form onSubmit={this.submitCourseDescription}>
								<TextField
									required
									id={this.moduleID+"_description"}
									defaultValue={this.state.descriptionInput}
									onChange={this.handleCourseDescription}
									label="Edit Module Type"
									variant="filled"
									autoComplete="off"
									multiline
								/>
								<ListItemSecondaryAction>
									<IconButton type="submit" edge="end">
										<CheckRounded />
									</IconButton>
								</ListItemSecondaryAction>
							</form>
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