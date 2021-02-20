import 'bootstrap/dist/css/bootstrap.min.css'

import { Route, Switch } from 'react-router-dom'

import About from './pages/about'
import Container from 'react-bootstrap/Container'
import Game from './pages/game'
import Header from './components/header'
import Home from './pages/home'
import React from 'react'

const App = () => {
  return (
    <div>
      <Header />
      <Container className='pt-4'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/game/:id' component={Game} />
        </Switch>
      </Container>
    </div>
  )
}

export default App
