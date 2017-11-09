import { addDecision } from 'redux/modules/decisions'
import { formatDecision } from 'helpers/utils'
import { saveToDecisions } from 'helpers/api'
import { Map } from 'immutable'

const MODAL_OPEN = 'MODAL_OPEN'
const MODAL_CLOSE = 'MODAL_CLOSE'
const UPDATE_DECISION = 'UPDATE_DECISION'

export function openModal () {
  return {
    type: MODAL_OPEN,
  }
}

export function closeModal () {
  return {
    type: MODAL_CLOSE,
  }
}

export function updateDecisionText ({title = undefined, firstDecision = undefined, secondDecision = undefined}) {
  return {
    type: UPDATE_DECISION,
    title,
    firstDecision,
    secondDecision,
  }
}

export function saveAndCloseModal () {
  return function (dispatch, getState) {
    const {modal, users} = getState()
    if (modal.get('isOpen')) {
      const userInfo = users.get(users.get('authedId')).get('info').toJS()
      const decision = formatDecision(
        {
          title: modal.get('title'),
          decisionOneText: modal.get('firstDecision'),
          decisionTwoText: modal.get('secondDecision'),
          user: userInfo,
          timestamp: Date.now(),
        })
      const {decisionId, decisionPromise} = saveToDecisions(decision)
      decisionPromise
        .then(() => {
          dispatch(addDecision(decisionId, decision))
          dispatch(closeModal())
        })
        .catch((err) => {
          console.warn('Error saving new Decision', err)
        })
    }
  }
}

const initialState = Map({
  isOpen: false,
  title: '',
  firstDecision: '',
  secondDecision: '',
})

export default function modal (state = initialState, action) {
  switch (action.type) {
    case MODAL_OPEN :
      return state.merge({
        isOpen: true,
      })
    case MODAL_CLOSE :
      return state.merge({
        isOpen: false,
        title: '',
        firstDecision: '',
        secondDecision: '',
      })
    case UPDATE_DECISION : {
      let tempState = action.title !== undefined
        ? state.merge({title: action.title})
        : state
      tempState = action.firstDecision !== undefined
        ? state.merge({firstDecision: action.firstDecision})
        : tempState
      tempState = action.secondDecision !== undefined
        ? state.merge({secondDecision: action.secondDecision})
        : tempState
      return tempState
    }
    default :
      return state
  }
}
