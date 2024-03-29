import React from 'react'
import { SelectableRow } from './SelectableRow'

export const SelectableTable = ({
  items = [],
  itemProperties = {},
  noHeader = false,
  selectedId,
  setSelectedId
}) => {
  return (
    <>
      <table>
        {
          !noHeader &&
            <thead>
              <tr>
                <th scope='col' />
                {Object.entries(itemProperties).map(([key, value]) => (
                  <th scope='col' key={key}>{value}</th>
                ))}
              </tr>
            </thead>
        }
        <tbody>
          {items.map((item) =>
            <SelectableRow
              key={item._id}
              item={item}
              itemProperties={itemProperties}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          )}
        </tbody>
      </table>
    </>
  )
}
