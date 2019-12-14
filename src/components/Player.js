import React from 'react'

class Player extends React.Component {
  state = {
    teamName: '',
    joined: false
  }
  render = () => {
    let { join, buzz } = this.props
    let { teamName, joined } = this.state
    return (
      <div className='player'>
        {!joined && (
          <div>
            <div>
              <input
                value={teamName}
                onChange={e => {
                  this.setState({ teamName: e.target.value })
                }}
              />
            </div>
            <button
              onClick={() => {
                join(teamName)
                this.setState({ joined: true })
              }}
            >
              JOIN
            </button>
          </div>
        )}
        {joined && (
          <div>
            <div className='team-name'>{teamName}</div>
            <button className='buzzer' onClick={() => buzz(false)}>
              BUZZ
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default Player
