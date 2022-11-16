import React, { useState, useEffect, useRef } from 'react'

import { ShortButton } from './ShortButton'
import { Input } from './Input'
import { SelectableTable } from './SelectableTable'
import { FullButton } from './FullButton'
import { useFetch } from '../hooks/useFetch'
import { useApi } from '../hooks/useApi'

export const ConvocationTopicsForm = ({
  convocationId,
  isActive,
  postSubmitActions
}) => {
  const [convocationTopics, setConvocationTopics] = useState([])
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [selectableTopics, setSelectableTopics] = useState([])
  const [isValidForm, setIsValidForm] = useState(false)

  const [apiUrl] = useApi()

  const [convocationFetch, setConvocationFetch] = useFetch()
  const [allTopicsFetch, setAllTopicsFetch] = useFetch()

  const formRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      formRef.current.focus()

      setConvocationTopics([])
      setSelectableTopics([])
      setConvocationFetch({
        apiUrl,
        path: 'convocations',
        objectId: convocationId
      })
      setAllTopicsFetch({
        apiUrl,
        path: 'topics'
      })
    }
  }, [isActive])

  useEffect(() => {
    if (convocationFetch.data.topicList) {
      setConvocationTopics(convocationFetch.data.topicList)
      const selectableTopics = allTopicsFetch.data.filter((topic) =>
        !convocationFetch.data.topicList.find(topicFind => topicFind._id === topic._id))
      setSelectableTopics(selectableTopics)
    }
  }, [convocationFetch.data, allTopicsFetch.data])

  useEffect(() => {
    setSelectedTopicId(null)
  }, [convocationTopics, selectableTopics])

  const handleDeleteTopic = () => {
    const newConvocationTopics = [...convocationTopics]
    const newSelectableTopics = [...selectableTopics]

    const topicIndex = convocationTopics.findIndex((topic) => topic._id === selectedTopicId)
    const deletedTopic = newConvocationTopics.splice(topicIndex, 1)[0]
    newSelectableTopics.push(deletedTopic)

    setConvocationTopics(newConvocationTopics)
    setSelectableTopics(newSelectableTopics)
    setIsValidForm(true)
  }

  const handleNewTopicChange = (e) => {
    const target = e.target
    const newTopicId = target.value
    const newConvocationTopics = [...convocationTopics]
    const newSelectableTopics = [...selectableTopics]

    const topicIndex = selectableTopics.findIndex((topic) => topic._id === newTopicId)
    const topicToAdd = newSelectableTopics.splice(topicIndex, 1)[0]
    newConvocationTopics.push(topicToAdd)

    setConvocationTopics(newConvocationTopics)
    setSelectableTopics(newSelectableTopics)
    setIsValidForm(true)
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
      <p aria-busy={convocationFetch.loading || allTopicsFetch.loading}>
        {(convocationFetch.loading || allTopicsFetch.loading) && 'Cargando temas...'}
      </p>
      <p className='warning'>{convocationFetch.error}</p>
      <p className='warning'>{!convocationFetch.error ? allTopicsFetch.error : null}</p>
      <FullButton
        buttonText='Eliminar Tema'
        className='contrast'
        disabled={!selectedTopicId}
        onClick={handleDeleteTopic}
      />
      <label>
        Temas disponibles
        <select
          name='availableTopics'
          aria-disabled={selectableTopics.length === 0}
          onChange={handleNewTopicChange}
        >
          {selectableTopics.length > 0
            ? <option value=''>Seleccione un Tema para añadir...</option>
            : <option value=''>No quedan Temas para añadir</option>}
          {selectableTopics
            ? selectableTopics.map((topic) => {
              return (
                <option key={topic._id} value={topic._id}>{`(${topic.shorthand}) ${topic.title}`}</option>
              )
            })
            : null}
        </select>
      </label>
    </div>
  )
}
