import React from 'react'
import { largeHeader, subHeader, centeredContainer } from './styles.css'

export default function Home () {
  return (
    <div className={centeredContainer}>
      <p className={largeHeader}>{'Would You Rather'}</p>
      <p className={subHeader}>{'The 100 year old American Classic'}</p>
    </div>
  )
}
