import React, { useState, useEffect, useRef } from 'react'

import { fetchAPI } from '../services/apiClientServices'
import { ShortButton } from './ShortButton'
import { Input } from './Input'
import { SelectableTable } from './SelectableTable'
import { FullButton } from './FullButton'

export const ConvocationTopicsForm = ({
  apiUrl,
  convocationId,
  isActive,
  postSubmitActions
}) => {
  const [convocationTopics, setConvocationTopics] = useState([])
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [selectableTopics, setSelectableTopics] = useState([])
  const [isValidForm, setIsValidForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const formRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      populateConvocationTopics()
      refreshTable()
      formRef.current.focus()
    }
  }, [isActive])

  const populateConvocationTopics = async () => {
    setErrorMessage(null)
    setIsLoading(true)
    try {
      let result = await fetchAPI({
        apiUrl,
        path: 'convocations',
        objectId: convocationId
      })

      if (result?.status === 'FAILED') {
        setErrorMessage(result.data.error)
      } else {
        const convocation = result?.data ? result.data : null
        setConvocationTopics(convocation.topicList)

        result = await fetchAPI({
          apiUrl,
          path: 'topics'
        })

        if (result?.status === 'FAILED') {
          setErrorMessage(result.data.error)
        } else {
          const allTopics = result?.data ? result.data : []
          const selectableTopics = allTopics.filter((topic) =>
            !convocationTopics.find(topicFind => topicFind._id === topic._id))
          setSelectableTopics(selectableTopics)
        }
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshTable = () => {
    setSelectedTopicId(null)
  }

  const handleDeleteTopic = () => {
    const topicIndex = convocationTopics.findIndex(topic => topic._id === selectedTopicId)
    const deletedTopic = convocationTopics.splice(topicIndex, 1)[0]
    selectableTopics.push(deletedTopic)
    setIsValidForm(true)
    refreshTable()
  }
  /*   const handleSubmit = async () => {
    const options = {
      body: JSON.stringify(newConvocation),
      method: newConvocation.id ? 'PATCH' : 'POST'
    }
    setIsLoading(true)
    try {
      const result = await fetchAPI({
        apiUrl,
        path: 'convocations',
        objectId: newConvocation.id,
        options
      })

      if (result?.status === 'FAILED') {
        setErrorMessage(result.data.error)
      } else {
        setNewConvocation(emptyConvocation)
        postSubmitActions()
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  } */

  /*   const handleKeyDown = (e) => {
    const keyName = e.key

    if (keyName === 'Enter') {
      e.preventDefault()
      confirmDeletion ? handleDeletion() : handleSubmit()
    }
    if (keyName === 'Escape') {
      confirmDeletion ? setConfirmDeletion(false) : postSubmitActions()
    }
  } */

  return (
    <div ref={formRef} tabIndex='0'>
      <SelectableTable
        items={convocationTopics}
        itemProperties={{
          position: '#',
          title: 'Título'
        }}
        selectedId={selectedTopicId}
        setSelectedId={setSelectedTopicId}
      />
      <p aria-busy={isLoading}>{isLoading && 'Cargando temas...'}</p>
      <p className='warning'>{errorMessage}</p>
      <FullButton
        buttonText='Eliminar Tema'
        className='contrast'
        disabled={!selectedTopicId}
        onClick={handleDeleteTopic}
      />
    </div>
  )
}
