import React from 'react'
import PropTypes from 'prop-types'
import { Results } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as routeActionCreators from 'redux/modules/route'

class ResultsContainer extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    authedUsersDecisions: PropTypes.object.isRequired,
    decisions: PropTypes.object.isRequired,
    error: PropTypes.string.isRequired,
    pushAndDispatch: PropTypes.func.isRequired,
  }
  handleClick = (decisionId, e) => {
    e.stopPropagation()
    this.props.pushAndDispatch(`/decide/${decisionId}`)
  }
  render () {
    const {isFetching, authedUsersDecisions, decisions, error} = this.props
    return (
      <Results
        isFetching={isFetching}
        authedUsersDecisions={authedUsersDecisions}
        decisions={decisions}
        handleClick={this.handleClick}
        error={error}/>
    )
  }
}

function mapStateToProps ({decisions, listeners, users}) {
  return {
    isFetching: decisions.get('isFetching'),
    authedUsersDecisions: users.get(users.get('authedId')).get('decisionsMade').toJS(),
    decisions: decisions.get('decisions').toJS(),
    error: decisions.get('error'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    routeActionCreators
    , dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsContainer)
