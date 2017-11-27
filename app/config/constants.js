import firebase from 'firebase'
import firestore from 'firebase/firestore'

firebase.initializeApp(config)

export const db = firebase.firestore()
export const firebaseAuth = firebase.auth

export const decisionsExpirationLength = 10000
