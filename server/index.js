if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

let scores = {}
let buzzOrder = []
const colors = [
  '#00F9FF',
  '#FF00A7',
  '#44FF00',
  '#F1FF00',
  '#CD00FF',
  '#00F9FF',
  '#FF00A7',
  '#44FF00'
]

const getColor = scores => {
  let i = 0
  let color = colors[i]
  let currColors = Object.keys(scores).map(teamId => scores[teamId].color)
  while (currColors.indexOf(color) !== -1 || i > colors.length) {
    i++
    color = colors[i]
  }
  return color
}

io.on('connection', socket => {
  if (Object.keys(scores).length !== 0 || buzzOrder.length > 0)
    io.emit('refresh', { scores, buzzOrder })

  socket.on('join', team => {
    scores[socket.id] = {
      name: team,
      score: 0,
      color: getColor(scores)
    }
    io.emit('joined', scores)
  })
  socket.on('new_round', team => {
    buzzOrder = []
    io.emit('new_round', buzzOrder)
  })
  socket.on('buzz', () => {
    if (buzzOrder.indexOf(socket.id) === -1) {
      buzzOrder.push(socket.id)
      io.emit('buzzer_order', buzzOrder)
    }
  })
  socket.on('verify', correct => {
    if (correct) {
      let winningTeam = buzzOrder.shift()
      scores[winningTeam].score++
      buzzOrder = []
      io.emit('correct', scores)
    } else {
      buzzOrder.shift()
      io.emit('incorrect', buzzOrder)
    }
  })

  socket.on('change_score', msg => {
    scores[msg.teamId].score += msg.amount
    io.emit('scores', scores)
  })

  socket.on('disconnect', () => {
    buzzOrder = buzzOrder.filter(e => e !== socket.id)
    delete scores[socket.id]
    io.emit('refresh', { scores, buzzOrder })
  })
})

app.use(express.static(path.resolve(__dirname, '..', 'build')))
app.get('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

const PORT = process.env.PORT || 9000
http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})
