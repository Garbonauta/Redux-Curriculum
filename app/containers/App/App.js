import React from 'react'
import PropTypes from 'prop-types'
import { HomeContainer, AuthenticateContainer, ResultsContainer,
  DecisionContainer, LogoutContainer } from 'containers'
import { Navigation } from 'components'
import { formatUserInfo, staleDecisions } from 'helpers/utils'
import * as usersActionCreators from 'redux/modules/users'
import * as routeActionCreators from 'redux/modules/route'
import * as decisionsActionCreators from 'redux/modules/decisions'
import { firebaseAuth } from 'config/constants'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { innerContainer } from 'sharedStyles/styles.css'

const PrivateRoute = ({component: Component, isAuthed, isFetching, push, ...rest}) => (
  <Route {...rest} render={props => {
    if (isFetching) {
      return null
    }

    const pathName = props.location.pathname
    if (pathName === '/' || pathName === '/auth') {
      if (isAuthed) {
        return <Redirect to='/results'/>
      }
    } else {
      if (!isAuthed) {
        return <Redirect to='/auth'/>
      }
    }
    return <Component {...props}/>
  }}/>
)
PrivateRoute.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isAuthed: PropTypes.bool.isRequired,
  location: PropTypes.object,
  component: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
}

class App extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    isAuthed: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    decisionsListener: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number.isRequired,
    removeUserFetching: PropTypes.func.isRequired,
    fetchingUserSuccess: PropTypes.func.isRequired,
    authUser: PropTypes.func.isRequired,
    pushAndDispatch: PropTypes.func.isRequired,
    fetchAndAddUsersMadeDecisions: PropTypes.func.isRequired,
    setAndHandleDecisionListener: PropTypes.func.isRequired,
  }
  componentDidMount = () => {
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        const [userData] = user.providerData
        const userInfo = formatUserInfo(
          {
            name: userData.displayName,
            avatar: userData.photoURL,
            uid: user.uid,
          })
        this.props.authUser(user.uid)
        this.props.fetchAndAddUsersMadeDecisions(user.uid)
        this.props.fetchingUserSuccess(user.uid, userInfo, Date.now())
      } else {
        this.props.removeUserFetching()
      }
    })
    if (!this.props.decisionsListener || staleDecisions(this.props.lastUpdated)) {
      this.props.setAndHandleDecisionListener(this.props.lastUpdated)
    }
  }

  render () {
    const {history, isAuthed, isFetching, pushAndDispatch} = this.props
    return (
      <ConnectedRouter history={history}>
        <div>
          <Navigation isAuthed={isAuthed}/>
          <div className={innerContainer}>
            <Switch>
              <PrivateRoute
                exact={true}
                path='/'
                isAuthed={isAuthed}
                isFetching={isFetching}
                push={pushAndDispatch}
                component={HomeContainer}/>
              <PrivateRoute
                path='/auth'
                isAuthed={isAuthed}
                isFetching={isFetching}
                push={pushAndDispatch}
                component={AuthenticateContainer}/>
              <PrivateRoute
                path='/results'
                isAuthed={isAuthed}
                isFetching={isFetching}
                push={pushAndDispatch}
                component={ResultsContainer}/>
              <PrivateRoute
                path='/decide/:decisionId'
                isAuthed={isAuthed}
                isFetching={isFetching}
                push={pushAndDispatch}
                component={DecisionContainer}/>
              <Route
                path='/logout'
                component={LogoutContainer}/>
            </Switch>
          </div>
        </div>
      </ConnectedRouter>
    )
  }
}

function mapStateToProps ({users, listeners, decisions}, props) {
  return {
    history: props.history,
    isAuthed: users.get('isAuthed'),
    isFetching: users.get('isFetching'),
    decisionsListener: listeners.get('decisions') === true,
    lastUpdated: decisions.get('lastUpdated'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      ...usersActionCreators,
      ...routeActionCreators,
      ...decisionsActionCreators,
    },
    dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)(App)
