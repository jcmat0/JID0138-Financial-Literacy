import React from 'react'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Collapse, FormControl, TextField, Button } from '@material-ui/core'
import { EditRounded, DeleteRounded, ExpandLessRounded, CheckRounded } from '@material-ui/icons'
import firebase from '../firebase'
import CourseDashboard from '../CourseDashboard'

export interface Course {
	name: string,
	description?: string,
	createdBy: string,
}

interface CourseDataProp {
	courseID: string,
	course: Course,
}

export class CourseList extends React.Component {
	public props : any
	private courseRef : any
	private className : any
	state = {
		courses: {},
	}

	constructor(props) {
		super(props)
		this.className = props.className
	}

	componentDidMount() {
		this.getCoursesReference()
	}

	async getCoursesReference() {
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

	renderCourse = data => {

		var renderOut = (
			<CourseListItem key={data[0]} courseID={data[0]} course={data[1]}/>
		)

		return renderOut
	}

	render() {
		const courses = Object.entries(this.state.courses)

		console.log("Updating courses, new course list:", courses)

		return (
			<List className={this.className}>
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

const courseKeys = {"name": true, "description": true, "createdBy": true}

class CourseListItem extends React.Component<CourseDataProp> {
	public courseID : string
	public state : any

	private courseRef : any

	constructor(props) {
		super(props)
		this.courseID = props.courseID
		this.state = {
			open: false,
			name: props.course.name,
			nameInput: props.course.name,
			description: props.course.description,
			descriptionInput: props.course.description,
			createdBy: props.course.createdBy,
		}

		this.getCourseReference()
	}

	async getCourseReference() {
		console.log("Setting up course listeners")
		this.courseRef = await firebase.getCourseRefByID(this.courseID)

		this.courseRef.on('child_added', this.propertyAdded)

		this.courseRef.on('child_changed', this.propertyChanged)

		this.courseRef.on('child_removed', this.propertyRemoved)
	}

	propertyAdded = propertyData => {
		console.log(propertyData.key, courseKeys, propertyData.key in courseKeys)
		if (propertyData.key in courseKeys) {
			this.setState({
				[propertyData.key]: propertyData.val()
			})
		}
	}

	propertyChanged = propertyData => {
		console.log(propertyData.key, courseKeys, propertyData.key in courseKeys)
		if (propertyData.key in courseKeys) {
			this.setState({
				[propertyData.key]: propertyData.val()
			})
		}
	}

	propertyRemoved = propertyData => {
		console.log(propertyData.key, courseKeys, propertyData.key in courseKeys)
		if (propertyData.key in courseKeys) {
			this.setState({
				[propertyData.key]: propertyData.val()
			})
		}
	}

	expand = () => {
		this.setState({open: !this.state.open})
	}

	deleteCourse = async () => {
		console.log("Deleting course", this.courseID)
		try {
			await Promise.all([(await firebase.getCourseRefByID(this.courseID)).remove(), (await firebase.getCurrentUserMembershipInCourseIDRef(this.courseID)).remove()])
		} catch(error) {
			console.log(error.message)
		}
	}

	handleCourseName = event => {
		this.setState({nameInput: event.target.value})
	}

	handleCourseDescription = event => {
		this.setState({descriptionInput: event.target.value})
	}

	submitCourseName = async event => {
		event.preventDefault()
		await (await firebase.getCourseRefByID(this.courseID)).update({
			name: this.state.nameInput
		})
	}

	submitCourseDescription = async event => {
		event.preventDefault()
		await (await firebase.getCourseRefByID(this.courseID)).update({
			description: this.state.descriptionInput
		})
	}

	getInnerControls = () => {
		if (this.state.createdBy === firebase.auth.currentUser?.uid) {
			return (
				<ListItemSecondaryAction>
					<IconButton edge="end" onClick={() => window.location.href = '/courseDashboard/' + this.courseID}>
					<Button> Edit Modules </Button>
					</IconButton>
					<IconButton edge="end" color="secondary" onClick={() => this.deleteCourse()}>
						<DeleteRounded />
					</IconButton>
					<IconButton edge="end" onClick={() => this.expand()}>
						{this.state.open ? <ExpandLessRounded /> : <EditRounded />}
					</IconButton>
				</ListItemSecondaryAction>
			)
		} else {
			return ""
		}
	}

	getOuterControls = () => {
		return (
			<Collapse in={this.state.open} timeout="auto" unmountOnExit>
					<List disablePadding dense>
						<ListItem key={this.courseID + "_name_control"} dense>
							<form onSubmit={this.submitCourseName}>
								<TextField
									required
									id={this.courseID+"_name"}
									defaultValue={this.state.nameInput}
									onChange={this.handleCourseName}
									label="Edit Course Name"
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
						<ListItem key={this.courseID + "_description"} dense>
							<form onSubmit={this.submitCourseDescription}>
								<TextField
									required
									id={this.courseID+"_description"}
									defaultValue={this.state.descriptionInput}
									onChange={this.handleCourseDescription}
									label="Edit Course Description"
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
				<ListItem key={this.courseID} button>
					<ListItemText
						primary={this.state.name || "Invalid course"}
						secondary={this.state.description || "No description"}
					/>
					{this.getInnerControls()}
				</ListItem>
				{this.getOuterControls()}
			</>
		)
	}
}