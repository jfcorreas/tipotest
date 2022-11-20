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
  const [newTopicPosition, setNewTopicPosition] = useState(-1)
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
      setNewTopicPosition(-1)
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
    setNewTopicPosition(-1)
    formRef.current.focus()
  }, [convocationTopics, selectableTopics])

  useEffect(() => {
    if (isActive) {
      postSubmitActions()
    }
  }, [convocationPatch.data])

  useEffect(() => {
    setNewTopicPosition(convocationTopics.findIndex((topic) => topic._id === selectedTopicId))
  }, [selectedTopicId])

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

  const handleNewPositionChange = (e) => {
    const target = e.target
    const newPosition = target.value

    if (newPosition > 0) setNewTopicPosition(Number(newPosition - 1))
  }

  const handleNewPositionSubmit = () => {
    const newConvocationTopics = [...convocationTopics]

    const selectedTopicIndex = convocationTopics.findIndex((topic) =>
      topic._id === selectedTopicId
    )
    const topicToMove = newConvocationTopics.splice(selectedTopicIndex, 1)[0]
    newConvocationTopics.splice(newTopicPosition, 0, topicToMove)

    setConvocationTopics(newConvocationTopics)
    setSelectedTopicId(null)
    setNewTopicPosition(-1)
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
        <FullButton
          buttonText='Eliminar Tema'
          className='contrast'
          disabled={!selectedTopicId}
          onClick={handleDeleteTopic}
        />
        <p aria-busy={convocationFetch.loading || allTopicsFetch.loading}>
          {(convocationFetch.loading || allTopicsFetch.loading) && 'Cargando temas...'}
        </p>
        <p className='warning'>{convocationFetch.error}</p>
        <p className='warning'>{!convocationFetch.error ? allTopicsFetch.error : null}</p>
        <Input
          type='number'
          min='1' max={convocationTopics.length}
          inputName='topicOrder' label='Cambiar posición del Tema seleccionado'
          placeholder='Ningún tema seleccionado'
          aria-disabled={!selectedTopicId}
          readOnly={!selectedTopicId}
          onChange={handleNewPositionChange}
          value={newTopicPosition > -1 ? newTopicPosition + 1 : ''}
        />
        <FullButton
          buttonText='Confirmar nueva posición'
          className='contrast outline'
          disabled={
            newTopicPosition === convocationTopics.findIndex((topic) =>
              topic._id === selectedTopicId
            )
          }
          onClick={handleNewPositionSubmit}
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
        <p aria-busy={convocationPatch.loading}>
          {convocationPatch.loading && 'Guardando cambios...'}
        </p>
        <p className='warning'>{convocationPatch.error}</p>
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
