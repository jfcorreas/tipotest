import React from 'react'

export const SelectableRow = ({
  item = { id: null },
  itemProperties = [],
  selectedId,
  setSelectedId
}) => {
  const isSelected = selectedId === item._id

  const handleRowClick = () => {
    const newSelectedId = isSelected ? '' : item._id
    setSelectedId(newSelectedId)
  }

  return (
    <tr
      key={item.id}
      id={item._id}
      title='Haga click para seleccionar'
      className={isSelected ? 'selected' : null}
      onClick={handleRowClick}
    >
      <td scope='row'>
        <input
          type='checkbox'
          readOnly
          checked={isSelected}
        />
      </td>
      {Object.entries(itemProperties).map(([key]) => (
        <td key={`${key}_${item._id}`}>{item[key]}</td>
      ))}
    </tr>
  )
}
