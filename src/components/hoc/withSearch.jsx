import React, { useState } from 'react'

export const withSearch = (Component) => ({ items, placeholder, ...rest }) => {
  const [search, setSearch] = useState('')

  const matches = items.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <a style={{ float: 'right' }} onClick={() => setSearch('')}> &nbsp;❎</a>
      <input
        type='text'
        placeholder={placeholder}
        style={{ float: 'right', maxWidth: '250px', maxHeight: '30px' }}
        onChange={(e) => setSearch(e.target.value)} value={search}
      />
      <Component items={matches} {...rest} />
    </>
  )
}
