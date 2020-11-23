import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Course } from '../Dashboard/courses'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { withRouter } from 'react-router-dom'
import { WithStyles, Paper, Card, Typography, Divider, FormControl, Grid, Input, InputLabel, ButtonGroup, Button, List, ListItem, ListItemText } from '@material-ui/core'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonBlockEditor from '@ckeditor/ckeditor5-build-balloon-block';
import firebase from '../firebase'

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
		flexDirection: 'column' as 'column', // typescript wants this casted for some reason
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

interface Styles {
	palette?: any,
	classes: {
		[key: string]: string
	},
}

interface Module {
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

class ModuleView extends React.Component {
	public props : Styles
	private module : Module
	private page : number
	private moduleID : string

	constructor(props) {
		super(props)
		this.props = props
		this.module = {
			name: "",
			type: "",
			courseID: "",
		}
		this.page = parseInt(props.match.params.page)
		this.moduleID = props.match.params.uid
		this.loadModule()
	}

	loadModule = async () => {
		this.module = await (await firebase.getModuleRefByID(this.moduleID)).once('value').then(snapshot => snapshot.val())
		this.setState({})
	}

	renderContents = () => {
		if (this.module.contents === undefined) {
			return (<>This module has no content.</>)
		}

		if (this.module.type === "Lecture") {
			const contents = Object.values(this.module.contents)
			contents.sort((a,b) => {
				return a.pageNum - b.pageNum
			})

			return (
				<>
					{contents.map(this.renderLectureContent)}
				</>
			)
		} else if (this.module.type === "Simulation") {
			for (const contentID in this.module.contents) {
				if (this.module.contents[contentID].pageNum == this.page) {
					console.log(this.module.contents[contentID])
					return this.renderSimulationContent(this.module.contents[contentID])
				}
			}
		}
		return (
			<Paper className={this.props.classes.paper}>
				<Typography>
					No content exists at this page.
				</Typography>
				{this.page}
				<ButtonGroup color="primary" variant="contained">
					<Button
						onClick={() => window.location.href = '/module/' + this.moduleID + '/' + (this.page - 1)}
					>
						Prev
					</Button>
					<Button
						onClick={() => window.location.href = '/module/' + this.moduleID + '/' + (this.page + 1)}
					>
						Next
					</Button>
				</ButtonGroup>
			</Paper>
		)
	}

	renderSimulationContent = content => {
		console.log(content.content)
		return (
			<Paper className={this.props.classes.paper}>
				<CKEditor
					editor={ BalloonBlockEditor }
					data={content.content}
					onReady={ editor => {
						editor.isReadOnly = true
					} }
				/>
				{content.pageNum}
				<ButtonGroup color="primary" variant="contained">
					<Button
						onClick={() => window.location.href = '/module/' + this.moduleID + '/' + (this.page - 1)}
					>
						Prev
					</Button>
					<Button
						onClick={() => window.location.href = '/module/' + this.moduleID + '/' + (this.page + 1)}
					>
						Next
					</Button>
				</ButtonGroup>
			</Paper>
		)
	}

	renderLectureContent = content => {
		return (
			<Paper className={this.props.classes.paper}>
				<CKEditor
					editor={ BalloonBlockEditor }
					data={content.content}
					onReady={ editor => {
						// You can store the "editor" and use when it is needed.
						editor.isReadOnly = true
					} }
				/>
				<Typography>
					{content.pageNum}
				</Typography>
			</Paper>
		)
	}

	render() {
		return (
			<main className={this.props.classes.main}>
				<Paper className={this.props.classes.paper}>
					<Typography component="h1" variant="h4">
						{ this.module.name }
					</Typography>
					<Typography component="h1" variant="h5">
						{ this.module.type }
					</Typography>
				</Paper>
				<Paper className={this.props.classes.paper}>
					{this.renderContents()}
				</Paper>
				<Paper className={this.props.classes.paper}>
					<Button color="primary" variant="contained" onClick={() => window.location.href = '/courseDashboard/' + this.module.courseID}>
						Return to Course Dashboard
					</Button>
				</Paper>
			</main>
		)
	}
}

export default withRouter(withStyles(styles)(ModuleView))