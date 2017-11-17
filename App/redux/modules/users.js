import { Map, fromJS } from 'immutable'
import auth, { logout, saveUser } from 'helpers/auth'
import { fetchUsersDecisions } from 'helpers/api'
import { formatUserInfo } from 'helpers/utils'

const AUTH_USER = 'AUTH_USER'
const UNAUTH_USER = 'UNAUTH_USER'
const FETCHING_USER = 'FETCHING_USER'
const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS'
const FETCHING_USER_ERROR = 'FETCHING_USER_ERROR'
const REMOVE_USER_FETCHING = 'REMOVE_USER_FETCHING'
const ADD_USERS_MADE_DECISIONS = 'ADD_USERS_MADE_DECISIONS'
const ADD_USER_DECISION = 'ADD_USER_DECISION'

export function authUser (uid) {
  return {
    type: AUTH_USER,
    uid,
  }
}

function unAuthUser () {
  return {
    type: UNAUTH_USER,
  }
}

function fetchingUser () {
  return {
    type: FETCHING_USER,
  }
}

export function fetchingUserSuccess (uid, user, timestamp) {
  return {
    type: FETCHING_USER_SUCCESS,
    uid,
    user,
    timestamp,
  }
}

function fetchingUserFailure (error) {
  console.warn(error)
  return {
    type: FETCHING_USER_ERROR,
    error: 'There was an Error fetching the user',
  }
}

export function addUserDecision (uid, decisionId, userDecision) {
  return {
    type: ADD_USER_DECISION,
    uid,
    decisionId,
    userDecision,
  }
}

export function removeUserFetching () {
  return {
    type: REMOVE_USER_FETCHING,
  }
}

export function addUsersMadeDecisions (uid, usersDecisions) {
  return {
    type: ADD_USERS_MADE_DECISIONS,
    uid,
    usersDecisions,
  }
}

export function fetchAndAddUsersMadeDecisions (uid) {
  return function (dispatch) {
    fetchUsersDecisions(uid)
      .then((decisions) => dispatch(addUsersMadeDecisions(uid, decisions)))
  }
}

export function fetchAndHandleAuthedUser () {
  return function (dispatch) {
    dispatch(fetchingUser())
    return auth().then(({user, credential}) => {
      const [userData] = user.providerData
      const userInfo = formatUserInfo(
        {
          name: userData.displayName,
          avatar: userData.photoURL,
          uid: user.uid,
        })
      return dispatch(fetchingUserSuccess(user.uid, userInfo, Date.now()))
    })
      .then(({user}) => saveUser(user))
      .then((user) => dispatch(authUser(user.uid)))
      .catch((error) => dispatch(fetchingUserFailure(error)))
  }
}

export function logoutAndUnauth () {
  return function (dispatch) {
    logout()
    dispatch(unAuthUser())
  }
}

const initialUserDecisionState = Map({
  chosen: '',
  text: '',
})

function userDecision (state = initialUserDecisionState, action) {
  switch (action.type) {
    case ADD_USER_DECISION:
      return state.merge({
        chosen: action.userDecision.chosen,
        text: action.userDecision.text,
      })
    default :
      return state
  }
}

function userDecisions (state = Map({}), action) {
  switch (action.type) {
    case ADD_USERS_MADE_DECISIONS :
      return fromJS({
        ...action.usersDecisions,
      })
    case ADD_USER_DECISION :
      return state.merge({
        [action.decisionId]: userDecision(state.get(action.decisionId), action),
      })
    default :
      return state
  }
}

const initialUserState = Map({
  lastUpdated: 0,
  decisionsMade: Map({}),
  info: {
    name: '',
    uid: '',
    avatar: '',
  },
})

function user (state = initialUserState, action) {
  switch (action.type) {
    case FETCHING_USER_SUCCESS :
      return state.merge({
        lastUpdated: action.timestamp,
        info: action.user,
      })
    case ADD_USERS_MADE_DECISIONS :
      return state.merge({
        decisionsMade: fromJS(action.usersDecisions),
      })
    case ADD_USER_DECISION :
      return state.merge({
        decisionsMade: userDecisions(state.get('decisionsMade'), action),
      })
    default :
      return state
  }
}

const initialState = Map({
  isAuthed: false,
  isFetching: true,
  error: '',
  authedId: '',
})

export default function users (state = initialState, action) {
  switch (action.type) {
    case AUTH_USER :
      return state.merge({
        isAuthed: true,
        authedId: action.uid,
      })
    case UNAUTH_USER :
      return state.merge({
        isAuthed: false,
        autehdId: '',
      })
    case FETCHING_USER :
      return state.merge({
        isFetching: true,
      })
    case FETCHING_USER_ERROR :
      return state.merge({
        isFetching: false,
        error: action.error,
      })
    case FETCHING_USER_SUCCESS :
      return state.merge({
        isFetching: false,
        error: '',
        [action.uid]: user(state.get(action.uid), action),
      })
    case REMOVE_USER_FETCHING :
      return state.merge({
        isFetching: false,
      })
    case ADD_USERS_MADE_DECISIONS :
    case ADD_USER_DECISION :
      return state.merge({
        [action.uid]: user(state.get(action.uid), action),
      })
    default :
      return state
  }
}
