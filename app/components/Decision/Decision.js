import React from 'react'
import PropTypes from 'prop-types'
import { formatPercent } from 'helpers/utils'
import { container, header, or, cardContainer, percentage, agree, decisionText, icon } from './styles.css'
import CircleCheck from 'react-icons/lib/fa/check-circle-o'

Decision.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  decisionId: PropTypes.string.isRequired,
  decision: PropTypes.object.isRequired,
  userSelection: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
}
export default function Decision ({isFetching, error, decisionId, decision, userSelection, handleClick}) {
  const title = decision.get('title')
  const decisionOne = decision.get('decisionOne')
  const decisionTwo = decision.get('decisionTwo')

  return (
    isFetching
      ? <p>{'Loading'}</p>
      : <div>
        <h2 className={header}>{title}</h2>
        <div style={{backgroundColor: 'rgb(102, 200, 235)'}} className={container}>
          <div className={or}><span>{'or'}</span></div>
          <div
            className={cardContainer}
            onClick={(e) => handleClick({
              decisionId,
              decisionNumber: 'decisionOne',
              text: decisionOne.get('text'),
              userSelection,
              e,
            })}>
            <div>
              {userSelection.chosen === 'decisionOne' && <CircleCheck className={icon}/>}
              <div
                style={{color: 'rgb(38, 126, 160)', textShadow: 'rgba(255, 255, 255, 0.5) 0px 1px 2px'}}
                className={percentage}>{formatPercent(decisionOne.get('count'), decisionOne.get('count') + decisionTwo.get('count'))}</div>
              <div className={agree}>{`${decisionOne.get('count')} agree`}</div>
              <div className={decisionText}>{decisionOne.get('text')}</div>
            </div>
          </div>
          <div
            style={{backgroundColor: 'rgb(231, 49, 48)'}}
            className={cardContainer}
            onClick={(e) => handleClick({
              decisionId,
              decisionNumber: 'decisionTwo',
              text: decisionTwo.get('text'),
              userSelection,
              e,
            })}>
            <div>
              {userSelection.chosen === 'decisionTwo' && <CircleCheck className={icon}/>}
              <div
                style={{color: 'rgb(126, 11, 11)', textShadow: 'rgba(255, 255, 255, 0.5) 0px 1px 2px'}}
                className={percentage}>{formatPercent(decisionTwo.get('count'), decisionOne.get('count') + decisionTwo.get('count'))}</div>
              <div className={agree}>{`${decisionTwo.get('count')} agree`}</div>
              <div className={decisionText}>{decisionTwo.get('text')}</div>
            </div>
          </div>
        </div>
      </div>
  )
}
