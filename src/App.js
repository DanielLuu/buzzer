import React from 'react'
import openSocket from 'socket.io-client'
import Host from './components/Host'
import Player from './components/Player'
import './App.css'

const socket = openSocket('http://localhost:9000')

class App extends React.Component {
  state = {
    ui: 'menu',
    scores: {},
    buzzOrder: []
  }

  componentDidMount = () => {
    socket.on('joined', scores => {
      this.setState({ scores })
    })

    socket.on('buzzer_order', buzzOrder => {
      this.setState({ buzzOrder })
    })

    socket.on('correct', scores => {
      this.setState({ scores, buzzOrder: [] })
    })
    socket.on('incorrect', buzzOrder => {
      this.setState({ buzzOrder })
    })
  }

  join = teamName => {
    socket.emit('join', teamName)
  }

  buzz = () => {
    socket.emit('buzz')
  }

  verify = correct => {
    socket.emit('verify', correct)
  }

  newRound = () => {
    socket.emit('new_round')
  }

  render = () => {
    let { ui, scores, buzzOrder } = this.state
    return (
      <div className='App'>
        {ui === 'menu' && (
          <div className='menu'>
            <button
              className='host-btn'
              onClick={() => this.setState({ ui: 'host' })}
            >
              HOST
            </button>
            <div className='or'>- OR -</div>
            <button
              className='player-btn'
              onClick={() => this.setState({ ui: 'player' })}
            >
              PLAYER
            </button>
          </div>
        )}
        {ui === 'host' && (
          <Host
            scores={scores}
            buzzOrder={buzzOrder}
            verify={this.verify}
            newRound={this.newRound}
          />
        )}
        {ui === 'player' && <Player join={this.join} buzz={this.buzz} />}
      </div>
    )
  }
}

export default App
