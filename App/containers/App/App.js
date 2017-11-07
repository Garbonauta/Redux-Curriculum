import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'
import HomeContainer from '../Home/HomeContainer'
import { Navigation } from 'components'
import { innerContainer } from 'sharedStyles/styles.css'

class App extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }
  render () {
    return (
      <ConnectedRouter history={this.props.history}>
        <div>
          <Navigation isAuthed={false}/>
          <div className={innerContainer}>
            <Switch>
              <Route
                exact={true}
                path='/'
                component={HomeContainer}/>
            </Switch>
          </div>
        </div>
      </ConnectedRouter>
    )
  }
}

export default App
