import React, { useState, useEffect } from 'react'
import { fetchAPI } from '../services/apiClientServices'

export const ListOfTopics = ({ apiUrl, convocationId, noTopicsText = 'Empty List' }) => {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [topics, setTopics] = useState([])

  useEffect(() => {
    setErrorMessage(null)
    if (convocationId) {
      setLoading(true)
      fetchAPI({
        apiUrl,
        path: 'convocations',
        objectId: convocationId
      })
        .then(result => {
          if (result?.status === 'FAILED') {
            setErrorMessage(result.data.error)
          } else {
            const convocation = result?.data ? result.data : null
            setTopics(convocation.topicList)
          }
        })
        .catch(error => {
          setErrorMessage(error.message)
        })
        .finally(setLoading(false))
    }
  }, [convocationId])
  // TODO: test if errorMessage and loading works
  if (errorMessage) return <div className='warning'>{errorMessage}</div>
  if (loading) return <p aria-busy />
  if (!convocationId) return <p>{noTopicsText}</p>

  return (
    <ol>
      {topics.map((topic) => {
        return (
          <li
            id={topic._id}
            key={topic._id}
            title={topic.fullTitle}
          >
            {topic.title}
          </li>
        )
      })}
    </ol>

  )
}
