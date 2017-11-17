import firebase from 'firebase'
import firestore from 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyCA6_ioLNbCuT3tLa1yQO9uy44oPb4qqCs',
  authDomain: 'redux-curriculum.firebaseapp.com',
  databaseURL: 'https://redux-curriculum.firebaseio.com',
  projectId: 'redux-curriculum',
  storageBucket: 'redux-curriculum.appspot.com',
  messagingSenderId: '289082769346',
}

firebase.initializeApp(config)

export const db = firebase.firestore()
export const firebaseAuth = firebase.auth

export const decisionsExpirationLength = 10000
