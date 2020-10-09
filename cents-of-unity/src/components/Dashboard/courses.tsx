import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import firebase from '../firebase'

export class CourseList extends React.Component {
	private courseRef : any
	state = {
		courses: {}
	}

	constructor(props) {
		super(props)

		this.renderCourse = this.renderCourse.bind(this)
	}

	componentDidMount() {
		this.getCourseReference()
	}

	async getCourseReference() {
		console.log("Setting up course listeners")
		this.courseRef = await firebase.getCurrentUserCoursesReference()

		this.courseRef.on('child_added', this.courseAdded)

		this.courseRef.on('child_changed', this.courseChanged)

		this.courseRef.on('child_removed', this.courseRemoved)
	}

	courseAdded = async courseData => {
		const newCourses = {
			[courseData.key]: await firebase.getCourseByID(courseData.key)
		}

		Object.assign(newCourses, this.state.courses)

		this.setState({
			courses: newCourses
		})
	}

	courseChanged = async courseData => {
		const newCourses = {
			[courseData.key]: await firebase.getCourseByID(courseData.key)
		}

		Object.assign(newCourses, this.state.courses)

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

	renderCourse(course) {
		console.log("Trying to render course", course)

		const renderOut = (
			<ListItem key={course.name} button>
				<ListItemText
					primary={course.name || "Invalid course"}
					secondary={course.description || "No description"}
				/>
			</ListItem>
		)

		console.log(renderOut)

		return renderOut
	}

	render() {
		console.log("Rendering course list", this.state)

		const courses = Object.values(this.state.courses)

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