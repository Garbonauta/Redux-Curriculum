import { Modal } from 'components'
import * as modalActionCreators from 'redux/modules/modal'
import * as decisionActionCreators from 'redux/modules/decisions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

function mapStateToProps ({modal}) {
  const title = modal.get('title')
  const titleLength = title.length
  const firstDecision = modal.get('firstDecision')
  const firstDecisionLength = firstDecision.length
  const secondDecision = modal.get('secondDecision')
  const secondDecisionLength = secondDecision.length
  return {
    isOpen: modal.get('isOpen'),
    title: title,
    firstDecision: firstDecision,
    secondDecision: secondDecision,
    isSubmitEnabled:
      (titleLength > 0 && titleLength <= 140) &&
      (firstDecisionLength > 0 && firstDecisionLength <= 140) &&
      (secondDecisionLength > 0 && secondDecisionLength <= 140),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      ...modalActionCreators,
      ...decisionActionCreators,
    }, dispatch,
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
