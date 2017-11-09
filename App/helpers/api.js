import { db } from 'config/constants'

export function saveToDecisions (decision) {
  const decisionDocument = db.collection('decisions').doc()
  const decisionPromise = decisionDocument.set(decision)

  return {
    decisionId: decisionDocument.id,
    decisionPromise,
  }
}

export function fetchUsersDecisions (uid) {
  let usersDecisions = {}
  return db.collection('users').doc(uid).collection('decisionsMade')
    .get().then((snapshot) => {
      snapshot.forEach((doc) => {
        usersDecisions[doc.id] = doc.data()
      })
      return usersDecisions
    })
}

export function listenToDecisions (cb, errorCB) {
  db.collection('decisions').onSnapshot((snapshot) => {
    let decisions = {}
    snapshot.forEach((doc) => {
      decisions[doc.id] = doc.data()
    })
    cb({decisions})
  }, errorCB)
}
