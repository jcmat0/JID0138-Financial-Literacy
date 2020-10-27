/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import { EditRounded, DeleteRounded } from '@material-ui/icons'
import firebase from '../firebase'
import CourseDashboard from '../CourseDashboard'

export type Course = {
	createdBy: string
	name: string
	modules: Array<any>
}

export class CourseList extends React.Component {
	private courseRef : any
	state = {
		courses: {}
	}

	componentDidMount() {
		this.getCourseReference()
	}

	async getCourseReference() {
		console.log("Setting up course listeners")
		this.courseRef = await firebase.getCurrentUserCoursesRef()
		console.log('course_ref', this.courseRef)
		this.courseRef.on('child_added', this.courseAdded)

		this.courseRef.on('child_changed', this.courseChanged)

		this.courseRef.on('child_removed', this.courseRemoved)
	}

	courseAdded = async courseData => {
		console.log("courseData", courseData)
		const newCourses = {
			[courseData.key]: await firebase.getCourseRefByID(courseData.key).then(reference => {
				return reference.once('value').then(snapshot => snapshot.val())
			})
		}
		console.log("before", newCourses)
		Object.assign(newCourses, this.state.courses)
		console.log("after", newCourses)
		this.setState({
			courses: newCourses
		})
	}

	courseChanged = async courseData => {
		const newCourses = {
			[courseData.key]: await firebase.getCourseRefByID(courseData.key).then(reference => {
				return reference.once('value').then(snapshot => snapshot.val())
			})
		}
		this.setState({
			courses: newCourses
		})
	}

	courseRemoved = async courseData => {
		const newCourses = Object.assign({}, this.state.courses)

		delete newCourses[courseData.key]

		this.setState({
			courses: newCourses
		})
	}

	renderCourse = entry => {
		const course = entry[1]
		console.log("Trying to render course", course)

		const renderOut = (
			<ListItem key={course.name} button>
				<ListItemText
					primary={course.name || "Invalid course"}
					secondary={course.description || "No description"}
					onClick={() => window.location.href = '/courseDashboard/' + entry[0]}
				/>
				{(course.createdBy === firebase.auth.currentUser?.uid) ?
					(
						<ListItemSecondaryAction>
							<IconButton edge="end">
								<EditRounded />
							</IconButton>
							<IconButton edge="end" color="secondary" onClick={() => this.deleteCourse(entry)}>
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

		const courses = Object.entries(this.state.courses)

		return (
			<List>
				{courses.length > 0 ? courses.map(this.renderCourse) : (
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