import React from 'react'

export const FullButton = ({
  buttonText = 'Empty',
  className = 'primary',
  disabled = false,
  onClick: handleClick
}) => {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={handleClick}
    >
      {buttonText}
    </button>
  )
}
