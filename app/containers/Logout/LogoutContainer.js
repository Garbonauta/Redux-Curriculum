import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as usersActionCreators from 'redux/modules/users'
import { Logout } from 'components'

class LogoutContainer extends React.Component {
  static propTypes = {
    logoutAndUnauth: PropTypes.func.isRequired,
  }
  componentDidMount = () => {
    this.props.logoutAndUnauth()
  }
  render () {
    return (
      <Logout/>
    )
  }
}

function mapStateToProps () {
  return {}
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators(usersActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutContainer)
