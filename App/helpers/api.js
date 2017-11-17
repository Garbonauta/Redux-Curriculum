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

export function saveUsersDecision (uid, decisionId, decision) {
  return db.collection('users').doc(uid).collection('decisionsMade').doc(decisionId).set(decision)
}

export function listenToDecisions (cb, errorCB) {
  db.collection('decisions').onSnapshot((snapshot) => {
    let decisions = {}
    snapshot.docChanges.forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        const doc = change.doc
        decisions[doc.id] = doc.data()
      }
    })
    const sortedIds = Object.keys(decisions).sort((a, b) => decisions[b].createDate - decisions[a].createDate)
    cb({decisions, sortedIds})
  }, errorCB)
}

export function addVoteDecision (decisionId, choice) {
  const docRef = db.collection('decisions').doc(decisionId)
  db.runTransaction((transaction) => {
    return transaction.get(docRef)
      .then((doc) => {
        const chosen = doc.data()[choice.chosen]
        transaction.update(docRef, {[choice.chosen]: {
          text: chosen.text,
          count: chosen.count + 1,
        }})
      })
  })
}

export function removeVoteDecision (decisionId, choice) {
  const docRef = db.collection('decisions').doc(decisionId)
  db.runTransaction((transaction) => {
    return transaction.get(docRef)
      .then((doc) => {
        const chosen = doc.data()[choice.chosen]
        const newCount = chosen.count - 1
        transaction.update(docRef, {[choice.chosen]: {
          text: chosen.text,
          count: newCount,

        }})
      })
  })
}
