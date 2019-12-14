import React from 'react'

export default ({
  scores,
  buzzOrder,
  verify,
  newRound,
  changeScore,
  scoreboard
}) => {
  return (
    <div className='host'>
      <div className='teams-title'>SCORE</div>
      <div className='scores'>
        {Object.keys(scores).map(teamId => {
          let team = scores[teamId]
          return (
            <div key={teamId} className='team'>
              <div>{team.name}</div>
              <div>
                {!scoreboard && (
                  <button
                    className='icon-btn'
                    onClick={() => changeScore(teamId, -1)}
                  >
                    -
                  </button>
                )}
                <span className='score'>{team.score}</span>
                {!scoreboard && (
                  <button
                    className='icon-btn'
                    onClick={() => changeScore(teamId, 1)}
                  >
                    +
                  </button>
                )}
              </div>
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
        {!scoreboard && (
          <button className='btn-alt' onClick={newRound}>
            New Round
          </button>
        )}
      </div>
      {!scoreboard && (
        <div className='buzz-btn-row'>
          <button
            className='correct'
            onClick={() => {
              verify(true)
            }}
          >
            Correct
          </button>
          <button
            className='incorrect'
            onClick={() => {
              verify(false)
            }}
          >
            Incorrect
          </button>
        </div>
      )}
    </div>
  )
}
