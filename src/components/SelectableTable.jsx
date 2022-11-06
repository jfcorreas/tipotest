import React from 'react'

export const SelectableTable = ({
  items = [],
  itemProperties = {},
  selectedId,
  setSelectedId
}) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th scope='col' />
            {Object.entries(itemProperties).map(([key, value]) => (
              <th scope='col' key={key}>{value}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            return (
              <tr
                key={item._id}
                id={item._id}
                title='Haga click para seleccionar'
                className={selectedId === item._id ? 'selected' : null}
                onClick={e => setSelectedId(e.currentTarget.id)}
              >
                <td scope='row'>
                  <input
                    type='checkbox'
                    readOnly
                    checked={selectedId === item._id}
                  />
                </td>
                {Object.entries(itemProperties).map(([key]) => (
                  <td key={`${key}_${item._id}`}>{item[key]}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
