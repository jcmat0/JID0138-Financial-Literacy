import CenteredGrid from '../centeredGrid'
import firebase from '../firebase'
import React, { useState, useMemo, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Course } from '../Dashboard/courses'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { withRouter } from 'react-router-dom'
import { WithStyles, Paper, Card, Typography, Divider, FormControl, Grid, Input, InputLabel, TextField, Button, List, ListItem, ListItemText } from '@material-ui/core'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonBlockEditor from '@ckeditor/ckeditor5-build-balloon-block';


const styles = theme => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(800 + theme.spacing.unit * 3 * 2)]: {
			width: 800,
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

export interface Module {
	name: string,
	type: string,
	courseID: string,
	contents?: {
		[key: string]: {
			pageNum: number,
			content: string,
		}
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
	type: "",
	courseID: "",
}

class ModuleEditor extends React.Component {
	public props : Styles & ModuleEditorProps
	public state : {
		module: Module
	}

	private editorData : {
		[key: string]: {
			pageNum: number,
			content: string,
		}
	}

	private moduleRef : any
	private disabled : boolean

	constructor(props) {
		super(props)
		this.props = props
		this.state = {module: emptyModule}
		this.editorData = {}
		this.getModuleReference(props.moduleID)
		this.disabled = false
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
		if (propertyData.key === 'contents' && this.state.module.contents !== undefined) {
			this.editorData = this.state.module.contents
		}
	}

	propertyChanged = propertyData => {
		const module = this.state.module
		module[propertyData.key] = propertyData.val()
		this.setState({module: module})
		if (propertyData.key === 'contents' && this.state.module.contents !== undefined) {
			this.editorData = this.state.module.contents
		}
	}

	propertyRemoved = propertyData => {
		const module = this.state.module
		delete module[propertyData.key]
		this.setState({module: module})
		if (propertyData.key === 'contents') {
			this.editorData = {}
		}
	}

	setEditorValue = (contentKey, value) => {
		console.log("Updating content for content ID", contentKey)
		this.editorData[contentKey].content = value
		this.setState({})
	}

	setPageNumber = (contentKey, value) => {
		console.log("Updating page for content ID", contentKey)
		this.editorData[contentKey].pageNum = value
		this.setState({})
	}

	updateContent = async (key) => {
		const module = this.state.module
		if (module.contents === undefined) {
			module.contents = {}
		}
		module.contents[key].content = this.editorData[key].content
		module.contents[key].pageNum = this.editorData[key].pageNum
		console.log(module, key, this.editorData[key].content, this.editorData[key].pageNum)
		await this.moduleRef.update(module)
		this.disabled = this.editorData[key].content === ""
		this.setState({module: module})
	}

	deleteContent = async (key) => {
		const module = this.state.module
		if (module.contents !== undefined) {
			delete this.editorData[key]
			delete module.contents[key]
			await this.moduleRef.update(module)
			this.setState({module: module})
		}
	}

	renderContent = (entry) => {
		const contentKey = entry[0]
		const contentData = entry[1].content

		if (this.editorData[contentKey] === undefined) {
			return ""
		} else {
			this.disabled = this.editorData[contentKey].content === ""
		}

		return (
			<Paper className={this.props.classes.paper} key={"editor_"+contentKey}>
				<CKEditor
					editor={ BalloonBlockEditor }
					data={contentData}
					onReady={ editor => {
						// You can store the "editor" and use when it is needed.
						console.log( 'Editor is ready to use!', editor )
					} }
					onChange={ ( event, editor ) => {
						const data = editor.getData()
						this.setEditorValue(contentKey, data)
					} }
					onBlur={ ( event, editor ) => {
						console.log( 'Blur.', editor )
					} }
					onFocus={ ( event, editor ) => {
						console.log( 'Focus.', editor )
					} }
				/>

				<TextField
					label="Page Number"
					type="number"
					variant="outlined"
					value={this.editorData[contentKey].pageNum}
					onChange={e => this.setPageNumber(contentKey, e.target.value)}
				/>

				<Button
					type="submit"
					variant="contained"
					disabled={this.disabled}
					color="primary"
					onClick={() => this.updateContent(contentKey)}
					className={this.props.classes.submit}
				>
					Update Content
				</Button>

				<Button
					type="submit"
					variant="contained"
					color="secondary"
					onClick={() => this.deleteContent(contentKey)}
					className={this.props.classes.submit}
				>
					Delete Content
				</Button>
			</Paper>
		)
	}

	createContent = async () => {
		await firebase.createContent(this.props.moduleID)
		this.getModuleReference(this.props.moduleID)
	}

	render() {
		if (this.state.module === null) {
			return "No module found"
		}

		if (this.state.module.contents === undefined) {
			return (
				<Button
					id="create_content_button"
					type="submit"
					variant="contained"
					color="primary"
					onClick={this.createContent}
					className={this.props.classes.submit}
				>
					Create Module Content
				</Button>
			)
		}

		return (
			<>
				{Object.entries(this.state.module.contents).map(this.renderContent)}
				<Button
					type="submit"
					variant="contained"
					color="primary"
					onClick={this.createContent}
					className={this.props.classes.submit}
				>
					Create Module Content
				</Button>
			</>
		)
	}
}

class ModuleEditPage extends React.Component {
	public state : {
		module: Module | null
	}
	private classes : {
		[key: string]: string
	}
	private uid : string

	constructor(props) {
		super(props)
		this.uid = props.match.params.uid
		this.state = {module: null}
		firebase.getModuleData(this.uid).then(module => {this.setState({module: module})})
		console.log(props)
		this.classes = props.classes
	}

	render() {
		if (this.state.module === undefined || this.state.module === null) {
			return (
				<main className={this.classes.main}>
					<Paper className={this.classes.paper}>
						Please wait...
					</Paper>
				</main>
			)
		}

		return (
			<main className={this.classes.main}>
				<Paper className={this.classes.paper}>
					<Typography component="h1" variant="h4">
						{ this.state.module.name }
					</Typography>
					<Typography component="h1" variant="h5">
						{ this.state.module.type }
					</Typography>
				</Paper>
				<Paper className={this.classes.paper}>
					<ModuleEditor moduleID={this.uid} classes={this.classes} />
				</Paper>
				<Paper className={this.classes.paper}>
					<Button color="primary" variant="contained" onClick={() => window.location.href = '/courseDashboard/' + this.state.module?.courseID}>
						Return to Course Dashboard
					</Button>
				</Paper>
			</main>
		)
	}
}

// @ts-ignore
export default withRouter(withStyles(styles)(ModuleEditPage))