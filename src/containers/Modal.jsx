import React from 'react'

export const Modal = ({
  open = false,
  handleClose,
  title = '',
  children
}) => {
  return (
    <dialog open={open}>
      <article>
        <a
          href='#close'
          aria-label='Close'
          className='close'
          onClick={handleClose}
        />
        <h3>{title}</h3>
        {children}

      </article>
    </dialog>
  )
}
