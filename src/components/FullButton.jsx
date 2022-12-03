import React from 'react'

export const FullButton = ({
  buttonText = 'Empty',
  appearance = 'primary',
  disabled = false,
  onClick: handleClick
}) => {
  return (
    <button
      className={appearance}
      disabled={disabled}
      onClick={handleClick}
    >
      {buttonText}
    </button>
  )
}
