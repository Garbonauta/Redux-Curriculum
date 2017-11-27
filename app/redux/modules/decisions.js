import { Map, fromJS } from 'immutable'
import { addListener } from './listeners'
import { listenToDecisions, saveUsersDecision, addVoteDecision, removeVoteDecision } from 'helpers/api'
import { staleDecisions, formatUsersDecision } from 'helpers/utils'
import { addUserDecision } from './users'

const SETTING_FEED_LISTENER = 'SETTING_FEED_LISTENER'
const SETTING_FEED_LISTENER_ERROR = 'SETTING_FEED_LISTENER_ERROR'
const SETTING_FEED_LISTENER_SUCCESS = 'SETTING_FEED_LISTENER_SUCCESS'
const ADD_DECISION = 'ADD_DECISION'
const ADD_VOTE = 'ADD_VOTE'
const REMOVE_VOTE = 'REMOVE_VOTE'

function settingFeedListener () {
  return {
    type: SETTING_FEED_LISTENER,
  }
}

function settingFeedListenerError (error) {
  console.warn(error)
  return {
    type: SETTING_FEED_LISTENER_ERROR,
    error: 'Error fetching results.',
  }
}

function settingFeedListenerSuccess (decisions) {
  return {
    type: SETTING_FEED_LISTENER_SUCCESS,
    timestamp: Date.now(),
    decisions,
  }
}

export function addDecision (decisionId, decision) {
  return ({
    type: ADD_DECISION,
    timestamp: Date.now(),
    decisionId,
    decision,
  })
}

function addVote (decisionId, decisionNumber) {
  return ({
    type: ADD_VOTE,
    decisionId,
    decisionNumber,
  })
}

function removeVote (decisionId, decisionNumber) {
  return ({
    type: REMOVE_VOTE,
    decisionId,
    decisionNumber,
  })
}

export function setAndHandleUserVote ({decisionId, decisionNumber, text, currentUserSelection}) {
  return function (dispatch, getState) {
    const authedId = getState().users.get('authedId')
    const userDecision = formatUsersDecision(decisionNumber, text)
    Promise.all([
      saveUsersDecision(authedId, decisionId, userDecision),
      addVoteDecision(decisionId, userDecision),
    ])
      .then(() => dispatch(addVote(decisionId, decisionNumber)))
      .then(() => dispatch(addUserDecision(authedId, decisionId, userDecision)))
      .then(() => {
        if (currentUserSelection.chosen && currentUserSelection.chosen !== decisionNumber) {
          return removeVoteDecision(decisionId, currentUserSelection)
        }
        return Promise.resolve('SUCCESS')
      })
      .then((value) => value !== 'SUCCESS' && dispatch(removeVote(decisionId, currentUserSelection.chosen)))
  }
}

export function setAndHandleDecisionListener (timestamp) {
  let initialFetch = true
  let stale = staleDecisions(timestamp)
  return function (dispatch) {
    dispatch(addListener('decisions'))
    dispatch(settingFeedListener())
    listenToDecisions(({decisions, sortedIds}) => {
      (initialFetch || stale) && dispatch(settingFeedListenerSuccess(decisions))
      initialFetch = false
      stale = false
    }, (error) => dispatch(settingFeedListenerError(error)))
  }
}

const initialVotingState = Map({
  count: 0,
  text: '',
})

function decisionVote (state = initialVotingState, action, decision = undefined) {
  switch (action.type) {
    case ADD_DECISION:
      return Map({
        text: decision.text,
        count: decision.count,
      })
    case ADD_VOTE:
      return state.merge({
        count: state.get('count') + 1,
      })
    case REMOVE_VOTE:
      return state.merge({
        count: state.get('count') - 1,
      })
    default :
      return state
  }
}

const initialDecisionState = Map({
  title: '',
  submittedUser: '',
  createDate: '',
  decisionOne: Map({}),
  decisionTwo: Map({}),
})

function singleDecision (state = initialDecisionState, action) {
  switch (action.type) {
    case ADD_DECISION : {
      const {title, submittedUser, createDate, decisionOne, decisionTwo} = action.decision
      return state.merge(fromJS({
        title,
        submittedUser,
        createDate,
        decisionOne: decisionVote(state.get('decisionOne'), action, decisionOne),
        decisionTwo: decisionVote(state.get('decisionTwo'), action, decisionTwo),
      }))
    }
    case ADD_VOTE :
    case REMOVE_VOTE:
      return state.merge({
        [action.decisionNumber]: decisionVote(state.get(action.decisionNumber), action),
      })
    default :
      return state
  }
}

const initialState = Map({
  isFetching: true,
  lastUpdated: 0,
  error: '',
  decisions: Map({}),
})

export default function decisions (state = initialState, action) {
  switch (action.type) {
    case SETTING_FEED_LISTENER :
      return state.merge({
        isFetching: true,
      })
    case SETTING_FEED_LISTENER_ERROR :
      return state.merge({
        isFetching: false,
        error: action.error,
      })
    case SETTING_FEED_LISTENER_SUCCESS :
      return state.merge({
        isFetching: false,
        lastUpdated: action.timestamp,
        error: '',
        decisions: fromJS({
          ...action.decisions,
        }),
      })
    case ADD_DECISION:
    case ADD_VOTE:
    case REMOVE_VOTE:
      return state.merge({
        decisions: state.get('decisions').merge(
          Map({[action.decisionId]: singleDecision(state.get('decisions').get(action.decisionId), action)}),
        ),
      })
    default :
      return state
  }
}
