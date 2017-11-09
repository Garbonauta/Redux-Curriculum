import React from 'react'
import PropTypes from 'prop-types'
import { formatPercent } from 'helpers/utils'
import { container, header, or, cardContainer, percentage, agree, decisionText } from './styles.css'

Decision.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  decision: PropTypes.object.isRequired,
}
export default function Decision ({isFetching, error, decision}) {
  const {title, decisionOne, decisionTwo} = decision
  return (
    isFetching
      ? <p>{'Loading'}</p>
      : <div>
        <h2 className={header}>{title}</h2>
        <div style={{backgroundColor: 'rgb(102, 200, 235)'}} className={container}>
          <div className={or}><span>{'or'}</span></div>
          <div className={cardContainer}>
            <div>
              <div
                style={{color: 'rgb(38, 126, 160)', textShadow: 'rgba(255, 255, 255, 0.5) 0px 1px 2px'}}
                className={percentage}>{formatPercent(decisionOne.count, decisionOne.count + decisionTwo.count)}</div>
              <div className={agree}>{`${decisionOne.count} agree`}</div>
              <div className={decisionText}>{decisionOne.text}</div>
            </div>
          </div>
          <div style={{backgroundColor: 'rgb(231, 49, 48)'}} className={cardContainer}>
            <div>
              <div
                style={{color: 'rgb(126, 11, 11)', textShadow: 'rgba(255, 255, 255, 0.5) 0px 1px 2px'}}
                className={percentage}>{formatPercent(decisionTwo.count, decisionOne.count + decisionTwo.count)}</div>
              <div className={agree}>{`${decisionTwo.count} agree`}</div>
              <div className={decisionText}>{decisionTwo.text}</div>
            </div>
          </div>
        </div>
      </div>
  )
}
