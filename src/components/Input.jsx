import React from 'react'

export const Input = ({
  inputName,
  label,
  placeholder,
  type,
  isRequired = null,
  isValid = null,
  onChange,
  value
}) => {
  return (
    <label>
      {label}
      <input
        name={inputName} type={type} required={isRequired}
        placeholder={placeholder}
        aria-invalid={(isValid === null) ? null : !isValid}
        onChange={onChange} value={value}
      />
    </label>
  )
}
