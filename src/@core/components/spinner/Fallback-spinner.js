import React from 'react'

const SpinnerComponent = ({ progress = 0 }) => {

  return (
    <div className="fallback-spinner app-loader">
      <h6>Please Wait...</h6>
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
        <span className="progress-text">{progress}%</span>
      </div>
    </div>
  )
}

export default SpinnerComponent