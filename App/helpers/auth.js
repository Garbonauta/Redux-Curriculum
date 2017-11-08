import { db, firebaseAuth } from 'config/constants'

export default function auth () {
  return firebaseAuth().signInWithPopup(new firebaseAuth.FacebookAuthProvider())
}

export function logout () {
  return firebaseAuth().signOut()
}

export function checkIfAuthed (store) {
  return store.getState().users.get('isAuthed')
}

export function saveUser (user) {
  return db.collection('users').doc(`${user.uid}`)
    .set(user)
    .then(() => user)
}
