import { Map } from 'immutable'
import { addListener } from './listeners'
import { listenToDecisions } from 'helpers/api'

const SETTING_FEED_LISTENER = 'SETTING_FEED_LISTENER'
const SETTING_FEED_LISTENER_ERROR = 'SETTING_FEED_LISTENER_ERROR'
const SETTING_FEED_LISTENER_SUCCESS = 'SETTING_FEED_LISTENER_SUCCESS'
const ADD_DECISION = 'ADD_DECISION'

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

export function setAndHandleDecisionListener () {
  return function (dispatch) {
    dispatch(addListener('decisions'))
    dispatch(settingFeedListener())
    listenToDecisions(({decisions}) => {
      dispatch(settingFeedListenerSuccess(decisions))
    }, (error) => dispatch(settingFeedListenerError(error)))
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
        decisions: Map({
          ...action.decisions,
        }),
      })
    case ADD_DECISION:
      return state.merge({
        decisions: state.get('decisions').merge(
          {[action.decisionId]: action.decision}),
      })
    default :
      return state
  }
}
