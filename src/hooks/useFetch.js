import { useState } from 'react'

import { fetchAPI } from '../services/apiClientServices'

export const useFetch = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const queryAPI = (fetchParams) => {
    setLoading(true)
    setError(null)
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

  return [{ data, loading, error }, queryAPI]
}
