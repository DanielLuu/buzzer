if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

let scores = {}
let buzzOrder = []

io.on('connection', socket => {
  console.log(socket.id + ' connected')
  socket.on('join', team => {
    console.log('team joined ' + team)
    scores[socket.id] = { name: team, score: 0 }
    io.emit('joined', scores)
  })
  socket.on('new_round', team => {
    buzzOrder = []
    io.emit('buzzer_order', buzzOrder)
  })
  socket.on('buzz', () => {
    if (buzzOrder.indexOf(socket.id) === -1) {
      console.log('buzz ' + socket.id)
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
  socket.on('disconnect', () => {
    console.log('user disconnected')
    buzzOrder = buzzOrder.filter(e => e !== socket.id)
    delete scores[socket.id]
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
