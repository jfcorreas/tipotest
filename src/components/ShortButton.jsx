import React from 'react'

export const ShortButton = ({
  buttonText = 'Empty',
  href = '#',
  appearance = 'primary',
  disabled = false,
  isLoading = false,
  onClick: handleClick = () => {}
}) => {
  return (
    <a
      role='button'
      href={href}
      className={appearance}
      disabled={disabled}
      aria-busy={isLoading}
      onClick={handleClick}
    >
      {buttonText}
    </a>
  )
}
