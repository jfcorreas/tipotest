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
  const [convocationPatch, setConvocationPatch] = useFetch()

  const formRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      formRef.current.focus()
      setIsValidForm(false)
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
    formRef.current.focus()
  }, [convocationTopics, selectableTopics])

  useEffect(() => {
    if (isActive) {
      postSubmitActions()
    }
  }, [convocationPatch.data])

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
  const handleSubmit = () => {
    const options = {
      body: JSON.stringify({ topicList: convocationTopics }),
      method: 'PATCH'
    }
    setConvocationPatch({
      apiUrl,
      path: 'convocations',
      subpath: 'topics',
      objectId: convocationId,
      options
    })
  }

  const handleKeyDown = (e) => {
    const keyName = e.key
    e.stopPropagation()
    if (keyName === 'Enter') {
      e.preventDefault()
      if (isValidForm) handleSubmit()
    }
    if (keyName === 'Escape') {
      postSubmitActions()
    }
  }

  return (
    <>
      <div tabIndex='0' ref={formRef} onKeyDown={handleKeyDown}>
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
        <p aria-busy={convocationPatch.loading}>
          {convocationPatch.loading && 'Guardando cambios...'}
        </p>
        <p className='warning'>{convocationFetch.error}</p>
        <p className='warning'>{!convocationFetch.error ? allTopicsFetch.error : null}</p>
        <p className='warning'>{convocationPatch.error}</p>
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
      <footer>
        <ShortButton
          buttonText='Cancelar'
          appearance='secondary'
          onClick={postSubmitActions}
        />
        <ShortButton
          buttonText='Guardar Cambios'
          disabled={!isValidForm}
          onClick={handleSubmit}
        />
      </footer>
    </>
  )
}
