import React, { useState, useEffect, useRef } from 'react'

import { ShortButton } from '../ShortButton'
import { Input } from '../Input'
import { Modal } from '../../containers/Modal'
import { useApi } from '../../hooks/useApi'
import { useFetch } from '../../hooks/useFetch'

const emptyTopic = {
  id: null,
  shorthand: null,
  title: null,
  fullTitle: null
}
export const TopicForm = ({
  topic,
  isActive,
  postSubmitActions
}) => {
  const [newTopic, setNewTopic] = useState(emptyTopic)
  const [isValidForm, setIsValidForm] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(false)

  const [apiUrl] = useApi()

  const [topicFetch, setTopicFetch] = useFetch()

  const inputRef = useRef(null)
  const confirmDeletionRef = useRef(null)

  useEffect(() => {
    setNewTopic(
      {
        id: topic ? topic._id : null,
        shorthand: topic ? topic.shorthand : null,
        title: topic ? topic.title : null,
        fullTitle: topic ? topic.fullTitle : null
      }
    )
    inputRef.current.focus()
  }, [isActive])

  useEffect(() => {
    if (isActive) {
      setNewTopic(emptyTopic)
      setConfirmDeletion(false)
      postSubmitActions()
    }
  }, [topicFetch.data])

  useEffect(() => {
    if (isActive) {
      confirmDeletion ? confirmDeletionRef.current.focus() : inputRef.current.focus()
    }
  }, [confirmDeletion])

  const handleInputChange = (e) => {
    const updatedTopic = { ...newTopic }
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const inputName = target.name

    if (inputName === 'year' && !value) {
      return
    }
    updatedTopic[inputName] = value

    const invalidForm = (
      !updatedTopic.shorthand || !updatedTopic.title
    )
    setIsValidForm(!invalidForm)
    setConfirmDeletion(false)
    setNewTopic(updatedTopic)
  }

  const handleSubmit = async () => {
    const options = {
      body: JSON.stringify(newTopic),
      method: newTopic.id ? 'PATCH' : 'POST'
    }
    setTopicFetch({
      apiUrl,
      path: 'topics',
      objectId: newTopic.id,
      options
    })
  }

  const handleDeletion = async () => {
    setTopicFetch({
      apiUrl,
      path: 'topics',
      objectId: newTopic.id,
      options: { method: 'DELETE' }
    })
  }

  const handleKeyDown = (e) => {
    const keyName = e.key
    const shiftKey = e.shiftKey
    e.stopPropagation()
    if (keyName === 'Enter' && !shiftKey) {
      e.preventDefault()
      confirmDeletion ? handleDeletion() : handleSubmit()
    }
    if (keyName === 'Escape') {
      confirmDeletion ? setConfirmDeletion(false) : postSubmitActions()
    }
  }

  const topicInputProperties = {
    shorthand: {
      required: true,
      type: 'text',
      label: 'Abreviatura',
      placeholder: 'Abreviatura del Título del tema',
      maxLength: '20',
      ref: inputRef
    },
    title: {
      required: true,
      type: 'text',
      label: 'Título',
      placeholder: 'Título del Tema'
    },
    fullTitle: {
      required: false,
      type: 'textarea',
      label: 'Título Completo',
      placeholder: 'Detalle de Todos los Conceptos del Tema'
    }
  }

  return (
    <>
      <form onKeyDown={handleKeyDown}>
        {
        Object.entries(topicInputProperties).map(([key, value]) => {
          return (
            <Input
              key={key}
              ref={value.ref}
              type={value.type}
              inputName={key} label={value.label}
              placeholder={value.placeholder}
              maxLength={value.maxLength}
              isRequired={value.required}
              isValid={
                ((newTopic[key] === null) || (topic && newTopic[key] === topic[key]))
                  ? null
                  : newTopic[key]
              }
              onChange={handleInputChange}
              value={newTopic[key] || ''}
            />
          )
        })

        }
      </form>
      {
        !confirmDeletion &&
          <p aria-busy={topicFetch.loading}>
            {topicFetch.loading && 'Aplicando cambios...'}
          </p>
      }
      <p className='warning'>{topicFetch.error}</p>
      <footer>
        <ShortButton
          buttonText='Cancelar'
          appearance='secondary'
          onClick={postSubmitActions}
        />
        <ShortButton
          buttonText='Eliminar'
          appearance='primary outline'
          disabled={newTopic.id === null}
          onClick={() => setConfirmDeletion(true)}
        />
        <ShortButton
          buttonText={topic ? 'Guardar Cambios' : 'Crear Tema'}
          disabled={!isValidForm}
          onClick={handleSubmit}
        />
      </footer>
      <Modal
        open={confirmDeletion}
        title='Atención'
        handleClose={() => setConfirmDeletion(false)}
        ref={confirmDeletionRef}
        handleKeyDown={handleKeyDown}
      >
        <p>
          ¿Seguro que quieres borrar el tema "{topic?.title}"?
        </p>
        <footer>
          <ShortButton
            buttonText='Cancelar'
            appearance='secondary'
            onClick={() => setConfirmDeletion(false)}
          />
          <ShortButton
            buttonText='Eliminar Tema'
            isLoading={topicFetch.loading}
            onClick={handleDeletion}
          />
        </footer>
      </Modal>
    </>
  )
}
