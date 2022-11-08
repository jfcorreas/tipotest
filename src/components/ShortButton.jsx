import React from 'react'

export const ShortButton = ({
  buttonText = 'Empty',
  href = '#',
  appearance = 'primary',
  disabled = false,
  onClick: handleClick
}) => {
  return (
    <a
      role='button'
      href={href}
      className={appearance}
      disabled={disabled}
      onClick={handleClick}
    >
      {buttonText}
    </a>
  )
}
