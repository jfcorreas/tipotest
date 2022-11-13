import React, { forwardRef } from 'react'

export const Modal = forwardRef(({
  open = false,
  handleClose,
  handleKeyDown,
  title = '',
  subtitle = '',
  children
}, ref) => {
  return (
    <dialog open={open}>
      <article ref={ref} onKeyDown={handleKeyDown} tabIndex='0'>
        <a
          aria-label='Close'
          className='close'
          onClick={handleClose}
        />
        <hgroup>
          <h3>{title}</h3>
          <h6>{subtitle}</h6>
        </hgroup>
        {children}

      </article>
    </dialog>
  )
})
