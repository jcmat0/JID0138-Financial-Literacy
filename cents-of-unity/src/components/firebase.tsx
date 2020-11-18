import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'
import 'firebase/firebase-database'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyB9m6PumbpoAcaNVyHgzMFySyD9zcAvml4",
  authDomain: "jid-0138.firebaseapp.com",
  databaseURL: "https://jid-0138.firebaseio.com",
  projectId: "jid-0138",
  storageBucket: "jid-0138.appspot.com",
  messagingSenderId: "60519309227",
  appId: "1:60519309227:web:238b81b541bc15bfc2fcee",
  measurementId: "G-B2JSELNCVB"
};

class Firebase {
	auth: app.auth.Auth;
	db: app.firestore.Firestore;
	database: app.database.Database;
	constructor() {
		app.initializeApp(config)
		this.auth = app.auth()
		this.db = app.firestore()
		this.database = app.database()
	}

	login(email, password) {
		console.log('in my custom login')
		return this.auth.signInWithEmailAndPassword(email, password)
	}

	logout() {
		return this.auth.signOut()
	}

	async register(name, email, password) {
		console.log('in register')
		await this.auth.createUserWithEmailAndPassword(email, password)
		console.log('created user', this.auth.currentUser)
		this.database.ref(`/users/${this.auth.currentUser?.uid}`).set({
			name,
		})
		return this.auth.currentUser?.updateProfile({
			displayName: name
		})
	}

	addPhone(phone) {
		if(!this.auth.currentUser) {
			return alert('Not authorized')
		}

		// return this.db.doc(`cents-of-unity/${this.auth.currentUser.uid}`).set({
		// 	quote
		// })
		return this.database.ref('users/' + this.auth.currentUser?.uid).update({
			"phone": phone
		})
	}

	addRole(role) {
		if(!this.auth.currentUser) {
			return alert('Not authorized')
		}

		return this.database.ref('users/' + this.auth.currentUser?.uid).update({
			"role": role
		})
	}

	async createCourse(name) {
		if (!this.auth.currentUser || (await this.getCurrentUserRole() !== "professor")) {
			return alert('Not authorized')
		}

		const newCourseRef = await this.database.ref('courses').push()
		const newCourseID = newCourseRef.key as string

		const coursesPromise = this.database.ref('courses/' + newCourseID).update({
			"createdBy": this.auth.currentUser?.uid,
			"name": name
		})
		const usersPromise = this.database.ref('users/' + this.auth.currentUser?.uid +'/courses').update({
			[newCourseID]: true
		})

		return Promise.all([coursesPromise, usersPromise])
	}

	async createModule(name, uid, moduleType) {
		if (!this.auth.currentUser || (await this.getCurrentUserRole() !== "professor")) {
			return alert('Not authorized')
		}

		const newModuleRef = await this.database.ref('modules').push()
		const newModuleID = newModuleRef.key as string

		const modulesPromise = newModuleRef.update({
			"createdBy": this.auth.currentUser?.uid,
			"courseID": uid,
			"name": name,
			"type": moduleType
		})

		const coursePromise = this.database.ref('courses/' + uid + '/modules').update({
			[newModuleID]: true
		})
		return Promise.all([modulesPromise, coursePromise])
	}

	async createContent(moduleID) {
		if (!this.auth.currentUser || (await this.getCurrentUserRole() !== "professor")) {
			return alert('Not authorized')
		}

		return this.database.ref('modules/' + moduleID + '/contents').push().update("Edit me!")
	}

	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	isAuthenticated() {
		return this.auth.currentUser
	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.displayName
	}

	async getCourseData(uid) {
		const courseData = await this.database.ref(`courses/${uid}`).once('value').then((snapshot) => snapshot.val())
		return courseData
	}

	async getModuleData(uid) {
		const moduleData = await this.database.ref(`modules/${uid}`).once('value').then((snapshot) => snapshot.val())
		return moduleData
	}

	async getCurrentUserPhone() {
		const phone = await this.database.ref(`users/${this.auth.currentUser?.uid}/phone`).once('value').then(function(view) {
			console.log(view.val())
			return view.val() || 'No Phone Number'
		})
		return phone
	}

	async getCurrentUserRole() {
		const role = await this.database.ref(`users/${this.auth.currentUser?.uid}/role`).once('value').then(function(view) {
			console.log(view.val())
			return view.val() || 'No Role'
		})
		return role
	}

	async getCurrentUserEmail() {
		return this.auth.currentUser?.email || "No Email"
	}

	async getCurrentUserCoursesIDs() {
		return this.database.ref(`users/${this.auth.currentUser?.uid}/courses`).once('value').then((snapshot) => Object.keys(snapshot.val()))
	}

	async getCurrentUserCoursesRef() {
		return this.database.ref(`users/${this.auth.currentUser?.uid}/courses`)
	}

	async getCourseModules(cid) {
		return this.database.ref(`courses/${cid}/modules`)
	}

	async getCurrentUserMembershipInCourseIDRef(id) {
		return this.database.ref(`users/${this.auth.currentUser?.uid}/courses/${id}`)
	}

	async getModuleExistenceInCourseIDRef(courseID, moduleID) {
		return this.database.ref(`courses/${courseID}/modules/${moduleID}`)
	}

	async getCourseRefByID(id) {
		return this.database.ref(`courses/${id}`)
	}

	async getModuleRefByID(id) {
		return this.database.ref(`modules/${id}`)
	}

	async updateUserEmail(email: string) {
		return this.auth.currentUser && this.auth.currentUser.updateEmail(email)
	}

	async updateUserPhone(phone) {
		return this.auth.currentUser && this.addPhone(phone)
	}
}

export default new Firebase()