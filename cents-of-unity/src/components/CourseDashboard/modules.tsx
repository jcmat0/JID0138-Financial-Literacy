import React, { useEffect } from 'react'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import { EditRounded, DeleteRounded } from '@material-ui/icons'
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
		const newModules = Object.assign({}, this.state.modules)

		delete newModules[courseData.key]

		this.setState({
			modules: newModules
		})
	}

	renderModule = entry => {
		const module = entry[1]
		const renderOut = (
			<ListItem key={module.name} button>
				<ListItemText
					primary={module.name || "Invalid module"}
					// secondary={module.description || "No description"}
				/>
				{(module.createdBy === firebase.auth.currentUser?.uid) ?
					(
						<ListItemSecondaryAction>
							<IconButton edge="end">
								<EditRounded />
							</IconButton>
							<IconButton edge="end" color="secondary" onClick={() => this.deleteModule(entry)}>
								<DeleteRounded />
							</IconButton>
						</ListItemSecondaryAction>
						)
					: ""
				}
			</ListItem>
		)

		console.log(renderOut)

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