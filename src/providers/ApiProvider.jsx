import { useState } from 'react'

import { apiContext } from '../apiContext'

export const ApiProvider = ({ apiUrlDefault, children, ...rest }) => {
  const [apiUrl, setApiUrl] = useState(apiUrlDefault)

  return (
    <apiContext.Provider value={[apiUrl, setApiUrl]}>
      {children}
    </apiContext.Provider>
  )
}
