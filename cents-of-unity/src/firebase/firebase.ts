import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: 'AIzaSyB9m6PumbpoAcaNVyHgzMFySyD9zcAvml4',
  authDomain: 'jid-0138.firebaseapp.com',
  databaseURL: 'https://jid-0138.firebaseio.com',
  projectId: 'jid-0138',
  storageBucket: 'jid-0138.appspot.com'
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const auth = firebase.auth()
export const db = firebase.database()
