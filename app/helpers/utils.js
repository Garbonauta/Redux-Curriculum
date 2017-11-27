import { decisionsExpirationLength } from 'config/constants'
export function formatUserInfo ({name, avatar, uid}) {
  return {
    uid,
    name,
    avatar,
  }
}

export function formatDecision (
  {title, decisionOneText, decisionOneCount = 0,
    decisionTwoText, decisionTwoCount = 0, user, timestamp}) {
  return {
    title,
    submittedUser: user,
    createDate: timestamp,
    decisionOne: {
      text: decisionOneText,
      count: decisionOneCount,
    },
    decisionTwo: {
      text: decisionTwoText,
      count: decisionTwoCount,
    },
  }
}

export function formatUsersDecision (decisionNumber, text) {
  return {
    chosen: decisionNumber,
    text,
  }
}

export function formatPercent (decisionCount, totalCount) {
  if (totalCount === 0) {
    return '0%'
  }
  const percent = Math.round((decisionCount / totalCount) * 100)
  return `${percent}%`
}

export function formatTimestamp (timestamp) {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

function getMilliseconds (timestamp) {
  return new Date().getTime() - new Date(timestamp).getTime()
}

export function staleDecisions (timestamp) {
  return getMilliseconds(timestamp) > decisionsExpirationLength
}
