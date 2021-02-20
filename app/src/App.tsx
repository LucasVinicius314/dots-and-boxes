import 'bootstrap/dist/css/bootstrap.min.css'

import { Route, Switch } from 'react-router-dom'

import About from './pages/about'
import Container from 'react-bootstrap/Container'
import Footer from './components/footer'
import Game from './pages/game'
import Header from './components/header'
import Home from './pages/home'
import React from 'react'
import api from './api'
import { model } from './types/index'

const App = () => {
  React.useEffect(() => {
    const effect = async () => {
      let id = sessionStorage.getItem('id')
      console.log('player id', id)
      if (id !== null) {
        await api.get(`user/verify/${id}`)
          .then(data => {
            console.log(data)
            const response: model.IBindResponse = data.data
            console.log(response.message)
          })
          .catch(error => {
            console.log(error)
            id = null
            sessionStorage.removeItem('id')
          })
      }
      if (id === null) {
        await api.get('user/bind')
          .then(data => {
            console.log(data)
            const bind: model.IBindQuery = data.data
            id = bind.id
            sessionStorage.setItem('id', bind.id)
            console.log('new player id', id)
          })
          .catch(console.log)
      }
    }
    effect()
  }, [])

  return (
    <div>
      <Header />
      <Container>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/game/:id' component={Game} />
        </Switch>
      </Container>
      <Footer />
    </div>
  )
}

export default App
