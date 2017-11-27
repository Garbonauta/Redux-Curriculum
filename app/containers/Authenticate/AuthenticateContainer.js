import React from 'react'
import PropTypes from 'prop-types'
import { Authenticate } from 'components'
import * as userActionCreators from 'redux/modules/users'
import * as routeActionCreators from 'redux/modules/route'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class AuthenticateContainer extends React.Component {
  static propTypes = {
    fetchAndHandleAuthedUser: PropTypes.func.isRequired,
    pushAndDispatch: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  }
  handleAuth = () => {
    this.props.fetchAndHandleAuthedUser()
      .then(() => this.props.pushAndDispatch('/results'))
  }
  render () {
    const { isFetching, error } = this.props
    return (
      <Authenticate
        onAuth={this.handleAuth}
        isFetching={isFetching}
        error={error}/>
    )
  }
}

function mapStateToProps ({users}) {
  return {
    isFetching: users.get('isFetching'),
    error: users.get('error'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {...userActionCreators,
      ...routeActionCreators}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthenticateContainer)
