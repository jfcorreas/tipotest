import React, { forwardRef } from 'react'

export const Input = forwardRef(({
  inputName,
  label,
  placeholder,
  type,
  isRequired = null,
  isValid = null,
  onChange,
  value,
  ...rest
}, ref) => {
  return (
    <label>
      {label}
      {
        type === 'textarea'
          ? (
            <textarea
              name={inputName} required={isRequired}
              ref={ref} placeholder={placeholder}
              aria-invalid={(isValid === null) ? null : !isValid}
              onChange={onChange} value={value}
              {...rest}
            />
            )
          : (
            <input
              name={inputName} type={type} required={isRequired}
              ref={ref} placeholder={placeholder}
              aria-invalid={(isValid === null) ? null : !isValid}
              onChange={onChange} value={value}
              {...rest}
            />
            )
      }
    </label>
  )
})
