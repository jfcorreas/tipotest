import React, { forwardRef } from 'react'

export const Modal = forwardRef(({
  open = false,
  handleClose,
  handleKeyDown,
  title = '',
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
        <h3>{title}</h3>
        {children}

      </article>
    </dialog>
  )
})
