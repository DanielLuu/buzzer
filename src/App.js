import React from 'react'
import openSocket from 'socket.io-client'
import Host from './components/Host'
import Player from './components/Player'
import buzz from './buzz.m4a'
import ping from './ping.mp3'
import wrong from './wrong.m4a'
import './App.css'

// const socket = openSocket('http://localhost:9000')
const socket = openSocket('https://buzzit-game.herokuapp.com/')

const buzzerSound = new Audio(buzz)
const correctSound = new Audio(ping)
const incorrectSound = new Audio(wrong)

class App extends React.Component {
  state = {
    ui: 'menu',
    scores: {},
    buzzOrder: []
  }

  componentDidMount = () => {
    socket.on('refresh', msg => {
      this.setState(msg)
    })
    socket.on('joined', scores => {
      this.setState({ scores })
    })
    socket.on('buzzer_order', buzzOrder => {
      let { ui } = this.state
      if (ui === 'host' || ui === 'score') {
        buzzerSound.play()
        this.setState({ buzzOrder })
      }
    })
    socket.on('new_round', buzzOrder => {
      this.setState({ buzzOrder })
    })
    socket.on('correct', scores => {
      let { ui } = this.state
      if (ui === 'host' || ui === 'score') {
        correctSound.play()
        this.setState({ scores, buzzOrder: [] })
      }
    })
    socket.on('incorrect', buzzOrder => {
      let { ui } = this.state
      if (ui === 'host' || ui === 'score') {
        incorrectSound.play()
        this.setState({ buzzOrder })
      }
    })
    socket.on('scores', scores => {
      this.setState({ scores })
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

  changeScore = (teamId, amount) => {
    socket.emit('change_score', { teamId, amount })
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
            <button
              className='scoreboard-btn'
              onClick={() => this.setState({ ui: 'score' })}
            >
              SCOREBOARD
            </button>
          </div>
        )}
        {ui === 'host' && (
          <Host
            scores={scores}
            buzzOrder={buzzOrder}
            verify={this.verify}
            newRound={this.newRound}
            changeScore={this.changeScore}
          />
        )}
        {ui === 'player' && <Player join={this.join} buzz={this.buzz} />}
        {ui === 'score' && (
          <Host scoreboard={true} scores={scores} buzzOrder={buzzOrder} />
        )}
      </div>
    )
  }
}

export default App
