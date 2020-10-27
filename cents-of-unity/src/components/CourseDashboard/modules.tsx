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
		this.getCourseReference()
	}

	async getCourseReference() {
		const {courseID} = this.props
		console.log("Setting up course listeners")
		this.moduleRef = await firebase.getCourseModules(courseID)
		console.log("refs?", this.moduleRef)
		this.moduleRef.on('child_added', this.courseAdded)

		this.moduleRef.on('child_changed', this.courseChanged)

		this.moduleRef.on('child_removed', this.courseRemoved)
	}

	courseAdded = async courseData => {

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

	courseChanged = async courseData => {
		const newCourses = {
			[courseData.key]: await firebase.getModuleRefByID(courseData.key).then(reference => {
				return reference.once('value').then(snapshot => snapshot.val())
			})
		}

		Object.assign(newCourses, this.state.modules)

		this.setState({
			modules: newCourses
		})
	}

	courseRemoved = async courseData => {
		const newModules = Object.assign({}, this.state.modules)

		delete newModules[courseData.key]

		this.setState({
			modules: newModules
		})
	}

	renderCourse = entry => {
		const moduleID = entry[0]
		console.log("Trying to render module", entry)
		const module = firebase.getModuleRefByID(moduleID)
		console.log("did it work?", module)
		// const renderOut = (
		// 	<ListItem key={course.name} button>
		// 		<ListItemText
		// 			primary={course.name || "Invalid course"}
		// 			secondary={course.description || "No description"}
		// 		/>
		// 		{(course.createdBy === firebase.auth.currentUser?.uid) ?
		// 			(
		// 				<ListItemSecondaryAction>
		// 					<IconButton edge="end">
		// 						<EditRounded />
		// 					</IconButton>
		// 					<IconButton edge="end" color="secondary" onClick={() => this.deleteCourse(entry)}>
		// 						<DeleteRounded />
		// 					</IconButton>
		// 				</ListItemSecondaryAction>
		// 				)
		// 			: ""
		// 		}
		// 	</ListItem>
		// )

		// console.log(renderOut)

		return {}
	}

	deleteCourse = async entry => {
		const key = entry[0]
		const course = entry[1]
		console.log("Deleting course", key, course)
		try {
			await Promise.all([(await firebase.getCourseRefByID(key)).remove(), (await firebase.getCurrentUserMembershipInCourseIDRef(key)).remove()])
		} catch(error) {
			console.log(error.message)
		}
	}

	render() {
		console.log("Rendering course list", this.state)

		const modules = Object.entries(this.state.modules)

		return (
			<List>
				{modules.length > 0 ? modules.map(this.renderCourse) : (
					<ListItem key="noCourses">
						<ListItemText
							secondary="No courses available"
						/>
					</ListItem>
				)}
			</List>
		)
	}
}