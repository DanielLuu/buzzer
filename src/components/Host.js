import React from 'react'

export default ({ scores, buzzOrder, verify, newRound }) => {
  return (
    <div className='host'>
      <div className='teams-title'>SCORE</div>
      <div className='scores'>
        {Object.keys(scores).map(teamId => {
          let team = scores[teamId]
          return (
            <div key={teamId} className='team'>
              <div>{team.name}</div>
              <div>{team.score}</div>
            </div>
          )
        })}
      </div>
      <div className='buzz-order-container'>
        <div className='buzz-order-title'>Buzz Order</div>
        <div className='buzz-order'>
          {buzzOrder.map((teamId, i) => {
            let team = scores[teamId]
            return (
              <div key={i}>
                {i + 1}.) {team.name}
              </div>
            )
          })}
        </div>
        <button onClick={newRound}>New Round</button>
      </div>
      <div className='buzz-btn-row'>
        <button className='correct' onClick={() => verify(true)}>
          Correct
        </button>
        <button className='incorrect' onClick={() => verify(false)}>
          Incorrect
        </button>
      </div>
    </div>
  )
}
