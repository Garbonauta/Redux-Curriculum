import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { ModalContainer } from 'containers'
import { navContainer, link, container } from './styles.css'

Navigation.propTypes = ActionLinks.PropTypes = NavLinks.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
}

function NavLinks ({isAuthed}) {
  return isAuthed
    ? <ul>
      <li>
        <NavLink className={link} exact={true} to='/'>{'Home'}</NavLink>
      </li>
    </ul> : null
}

function ActionLinks ({isAuthed}) {
  return isAuthed
    ? <ul>
      <li>
        <ModalContainer />
      </li>
      <li>
        <NavLink className={link} to='/logout'>{'Logout'}</NavLink>
      </li>
    </ul>
    : <ul>
      <li>
        <NavLink className={link} to='/'>{'Home'}</NavLink>
      </li>
      <li>
        <NavLink className={link} to='/auth'>{'Authenticate'}</NavLink>
      </li>
    </ul>
}

export default function Navigation ({isAuthed}) {
  return (
    <div className={container}>
      <nav className={navContainer}>
        <NavLinks isAuthed={isAuthed}/>
        <ActionLinks isAuthed={isAuthed}/>
      </nav>
    </div>
  )
}
