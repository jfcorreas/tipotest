import React from 'react'

export const Select = ({
  selectName,
  label,
  placeholder,
  type,
  isRequired = null,
  isValid = null,
  isLoading = null,
  onChange,
  value,
  children,
  ...rest
}) => {
  return (
    <label>
      {label}
      <select
        name={selectName} required={isRequired}
        placeholder={placeholder}
        aria-invalid={(isValid === null) ? null : !isValid}
        aria-busy={isLoading}
        onChange={onChange} value={value}
        {...rest}
      >
        {children}
      </select>

    </label>
  )
}
