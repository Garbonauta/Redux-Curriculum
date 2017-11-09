import React from 'react'
import PropTypes from 'prop-types'
import { Decision } from 'components'
import * as decisionsActionCreators from 'redux/modules/decisions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class DecisionContainer extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    decision: PropTypes.object.isRequired,
    decisionsListener: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number.isRequired,
    setAndHandleDecisionListener: PropTypes.func.isRequired,
  }
  render () {
    return (
      <Decision
        isFetching={this.props.isFetching}
        error={this.props.error}
        decision={this.props.decision}/>
    )
  }
}

function mapStateToProps ({users, decisions, listeners}, props) {
  const selectedDecision = props.match.params.decisionId
  return {
    isFetching: decisions.get('isFetching'),
    error: decisions.get('error'),
    decision: decisions.get('decisions').get(selectedDecision) || {},
    decisionsListener: listeners.get('decisions') === true,
    lastUpdated: decisions.get('lastUpdated'),
    // usersSelection: users.get(users.get('authedId')).get('decisionsMade').get(selectedDecision) || {},
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    decisionsActionCreators,
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DecisionContainer)
