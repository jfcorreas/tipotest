import { useState } from 'react'

import { fetchAPI } from '../services/apiClientServices'

export const useFetch = () => {
  const [data, setData] = useState([])
  const [method, setMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const queryAPI = (fetchParams) => {
    setLoading(true)
    setError(null)
    setMethod(fetchParams?.options?.method ? fetchParams.options.method : 'GET')
    fetchAPI(fetchParams)
      .then((result) => {
        if (result?.status === 'FAILED') {
          setError(result.data.error)
        } else {
          setData(result?.data ? result.data : [])
        }
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false))
  }

  return [{ data, method, loading, error }, queryAPI]
}
