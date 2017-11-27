import React from 'react'
import PropTypes from 'prop-types'
import { formatTimestamp } from 'helpers/utils'
import Loader from 'react-loader'
import CircleOutline from 'react-icons/lib/fa/circle-o'
import CircleCheck from 'react-icons/lib/fa/check-circle-o'
import { errorMsg, header, decisionContainer, decisionTitle, icon } from './styles.css'

const selectedStyle = {
  borderLeftColor: 'rgb(102, 200, 235)',
}

const defaultStyle = {
  borderLeftColor: 'rgb(231, 49, 48)',
}

Results.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  authedUsersDecisions: PropTypes.object.isRequired,
  decisions: PropTypes.object.isRequired,
  error: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
}
export default function Results ({error, isFetching, decisions, authedUsersDecisions, handleClick}) {
  const sortedIds = Object.keys(decisions).sort((a, b) => decisions[b].createDate - decisions[a].createDate)
  return (
    <Loader loaded={!isFetching}>
      {
        error
          ? <p className={errorMsg}>{'error'}</p>
          : <div>
            <h2 className={header}>{'Decisions'}</h2>
            {sortedIds.map((id) => {
              const {title, createDate, submittedUser} = decisions[id]
              const authedByUser = authedUsersDecisions.hasOwnProperty(id)
              return (
                <div
                  style={authedByUser ? selectedStyle : defaultStyle}
                  className={decisionContainer}
                  key={id}
                  onClick={(e) => handleClick(id, e)} >
                  <div>
                    <div className={decisionTitle}>{title}</div>
                    <div>
                      <span>{`${formatTimestamp(createDate)} by ${submittedUser.name}`}</span>
                    </div>
                  </div>
                  <div>
                    {authedByUser
                      ? <CircleCheck className={icon}/>
                      : <CircleOutline className={icon}/>}
                  </div>
                </div>
              )
            })}
          </div>
      }
    </Loader>
  )
}
