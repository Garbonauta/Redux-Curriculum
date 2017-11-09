import React from 'react'
import PropTypes from 'prop-types'
import { default as ReactModal } from 'react-modal'
import {
  darkBtn, newDecisionTop, titleContainer, decisionContainer,
  titleInput, decisionInput, or, submitDecisionBtn } from './styles.css'

const modalStyles = {
  content: {
    width: 400,
    margin: '0px auto',
    height: 460,
    borderRadius: 5,
    background: '#EBEBEB',
    padding: 0,
    position: 'absolute',
  },
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  firstDecision: PropTypes.string.isRequired,
  secondDecision: PropTypes.string.isRequired,
  isSubmitEnabled: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  saveAndCloseModal: PropTypes.func.isRequired,
  updateDecisionText: PropTypes.func.isRequired,
}
export default function Modal (
  {isOpen, title, firstDecision, secondDecision,
    isSubmitEnabled, openModal, closeModal, saveAndCloseModal, updateDecisionText}) {
  return (
    <div>
      <span className={darkBtn} onClick={openModal}>{'New Decision'}</span>
      <ReactModal style={modalStyles} isOpen={isOpen} onRequestClose={closeModal}>
        <div className={newDecisionTop}>
          <span>{'Would you rather...'}</span>
          <span onClick={closeModal}>{'X'}</span>
        </div>
        <div className={titleContainer}>
          <textarea
            className={titleInput}
            onChange={(e) => updateDecisionText({title: e.target.value})}
            value={title}
            maxLength={140}
            type='text'
            placeholder='Title'/>
        </div>
        <div className={decisionContainer}>
          <textarea
            className={decisionInput}
            onChange={(e) => updateDecisionText({firstDecision: e.target.value})}
            value={firstDecision}
            maxLength={140}
            type='text'
            placeholder='First Decision'/>
        </div>
        <div className={or}>{'OR'}</div>
        <div className={decisionContainer}>
          <textarea
            className={decisionInput}
            onChange={(e) => updateDecisionText({secondDecision: e.target.value})}
            value={secondDecision}
            maxLength={140}
            type='text'
            placeholder='Second Decision'/>
        </div>
        <button
          className={submitDecisionBtn}
          disabled={!isSubmitEnabled}
          onClick={saveAndCloseModal}>
          {'Submit'}
        </button>
      </ReactModal>
    </div>
  )
}
