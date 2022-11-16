import React, { forwardRef } from 'react'

export const Input = forwardRef(({
  inputName,
  label,
  placeholder,
  type,
  isRequired = null,
  isValid = null,
  onChange,
  value
}, ref) => {
  return (
    <label>
      {label}
      <input
        name={inputName} type={type} required={isRequired}
        ref={ref} placeholder={placeholder}
        aria-invalid={(isValid === null) ? null : !isValid}
        onChange={onChange} value={value}
      />
    </label>
  )
})