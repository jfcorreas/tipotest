import React from 'react'

export const ConvocationForm = ({
  apiUrl,
  open = false,
  convocation,
  handleClose
}) => {
  const handleKeyDown = () => {
    return null
  }

  return (
    <div
      tabIndex='0'
      onKeyDown={open ? handleKeyDown : null}
    >
      <dialog open={open}>
        <article>
          <a
            href='#close'
            aria-label='Close'
            className='close'
            onClick={handleClose}
          />
        </article>
      </dialog>
    </div>
  )
}
