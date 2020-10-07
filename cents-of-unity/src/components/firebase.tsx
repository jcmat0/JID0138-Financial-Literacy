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

	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.displayName
	}

	async getCurrentUserPhone() {
		const phone = await this.database.ref(`users/${this.auth.currentUser?.uid}`).once('value').then(function(view) {
			console.log(view.val())
			return view.val().phone || 'No Phone Number'
		})
		return phone
	}

	async getCurrentUserRole() {
		const role = await this.database.ref(`users/${this.auth.currentUser?.uid}`).once('value').then(function(view) {
			console.log(view.val())
			return view.val().role || 'No Role'
		})
		return role
	}

	async getCurrentUserEmail() {
		return this.auth.currentUser?.email || "No Email"
	}

	async updateUserEmail(email: string) {
		return this.auth.currentUser && this.auth.currentUser.updateEmail(email)
	}

	async updateUserPhone(phone) {
		return this.auth.currentUser && this.addPhone(phone)
	}
}

export default new Firebase()