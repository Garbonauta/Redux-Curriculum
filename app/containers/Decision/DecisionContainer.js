import React from 'react'
import PropTypes from 'prop-types'
import { Decision } from 'components'
import * as decisionsActionCreators from 'redux/modules/decisions'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { bindActionCreators } from 'redux'

class DecisionContainer extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    selectedDecisionId: PropTypes.string.isRequired,
    decision: PropTypes.object.isRequired,
    decisionsListener: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number.isRequired,
    userSelection: PropTypes.object.isRequired,
    setAndHandleUserVote: PropTypes.func.isRequired,
  }
  handleClick = ({decisionId, decisionNumber, text, userSelection, e}) => {
    e.preventDefault()
    decisionNumber !== userSelection.chosen && this.props.setAndHandleUserVote(
      {decisionId,
        decisionNumber,
        text,
        currentUserSelection: userSelection})
  }

  render () {
    return (
      <Decision
        isFetching={this.props.isFetching}
        error={this.props.error}
        decisionId={this.props.selectedDecisionId}
        decision={this.props.decision}
        userSelection={this.props.userSelection.toJS()}
        handleClick={this.handleClick}/>
    )
  }
}

function mapStateToProps ({users, decisions, listeners}, props) {
  const selectedDecision = props.match.params.decisionId
  return {
    isFetching: decisions.get('isFetching'),
    error: decisions.get('error'),
    selectedDecisionId: selectedDecision,
    decision: decisions.get('decisions').get(selectedDecision) || Map({}),
    decisionsListener: listeners.get('decisions') === true,
    lastUpdated: decisions.get('lastUpdated'),
    userSelection: users.get(users.get('authedId')).get('decisionsMade').get(selectedDecision) || Map({}),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    decisionsActionCreators,
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DecisionContainer)
