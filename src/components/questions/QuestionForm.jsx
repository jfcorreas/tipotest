import React, { useState, useEffect, useRef } from 'react'

import { ShortButton } from '../ShortButton'
import { Input } from '../Input'
import { Modal } from '../../containers/Modal'
import { useApi } from '../../hooks/useApi'
import { useFetch } from '../../hooks/useFetch'
import { Select } from '../Select'

const emptyQuestion = {
  id: null,
  text: null,
  topic: null
}
export const QuestionForm = ({
  question,
  topicFilter = null,
  isActive,
  postSubmitActions
}) => {
  const [newQuestion, setNewQuestion] = useState(emptyQuestion)
  const [isValidForm, setIsValidForm] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(false)

  const [apiUrl] = useApi()

  const [questionFetch, setQuestionFetch] = useFetch()
  const [topicsFetch, setTopicsFetch] = useFetch()

  const inputRef = useRef(null)
  const confirmDeletionRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      inputRef.current.focus()
      setNewQuestion(
        {
          id: question ? question._id : null,
          text: question ? question.text : null,
          topic: question?.topic ? question.topic._id : topicFilter
        }
      )
      setTopicsFetch({
        apiUrl,
        path: 'topics'
      })
    } else {
      setNewQuestion(emptyQuestion)
    }
  }, [isActive])

  useEffect(() => {
    if (isActive) {
      setNewQuestion(emptyQuestion)
      setConfirmDeletion(false)
      postSubmitActions()
    }
  }, [questionFetch.data])

  useEffect(() => {
    if (isActive) {
      confirmDeletion ? confirmDeletionRef.current.focus() : inputRef.current.focus()
    }
  }, [confirmDeletion])

  const handleInputChange = (e) => {
    const updatedQuestion = { ...newQuestion }
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const inputName = target.name

    updatedQuestion[inputName] = value

    const invalidForm = (
      !updatedQuestion.text || !updatedQuestion.topic
    )
    setIsValidForm(!invalidForm)
    setConfirmDeletion(false)
    setNewQuestion(updatedQuestion)
  }

  const handleSubmit = async () => {
    const options = {
      body: JSON.stringify(newQuestion),
      method: newQuestion.id ? 'PATCH' : 'POST'
    }
    setQuestionFetch({
      apiUrl,
      path: 'questions',
      objectId: newQuestion.id,
      options
    })
  }

  const handleDeletion = async () => {
    setQuestionFetch({
      apiUrl,
      path: 'questions',
      objectId: newQuestion.id,
      options: { method: 'DELETE' }
    })
  }

  const handleKeyDown = (e) => {
    const keyName = e.key
    e.stopPropagation()
    if (keyName === 'Enter') {
      e.preventDefault()
      confirmDeletion ? handleDeletion() : (isValidForm && handleSubmit())
    }
    if (keyName === 'Escape') {
      confirmDeletion ? setConfirmDeletion(false) : postSubmitActions()
    }
  }
  return (
    <>
      <form onKeyDown={handleKeyDown}>
        <Input
          ref={inputRef}
          type='text'
          inputName='text' label='Texto'
          placeholder='Enunciado de la Pregunta'
          isRequired
          isValid={
            ((newQuestion.text === null) || (question && newQuestion.text === question.text))
              ? null
              : newQuestion.text
          }
          onChange={handleInputChange}
          value={newQuestion.text || ''}
        />
        <Select
          selectName='topic' type='text' isRequired
          placeholder='Tema al que Corresponde la Pregunta'
          isValid={
            ((newQuestion.topic === null) || (question && newQuestion.topic === question.topic._id))
              ? null
              : newQuestion.topic
          }
          isLoading={topicsFetch.loading}
          onChange={handleInputChange}
          value={newQuestion.topic || ''}
        >
          <option value=''>Seleccione un Tema...</option>
          {topicsFetch.data?.map((topic) => {
            return (
              <option key={topic._id} value={topic._id}>{topic.title}</option>
            )
          })}
        </Select>
        <p className='warning'>{topicsFetch.error}</p>

      </form>
      {
        !confirmDeletion &&
          <p aria-busy={questionFetch.loading}>
            {questionFetch.loading && 'Aplicando cambios...'}
          </p>
      }
      <p className='warning'>{questionFetch.error}</p>
      <footer>
        <ShortButton
          buttonText='Cancelar'
          appearance='secondary'
          onClick={postSubmitActions}
        />
        <ShortButton
          buttonText='Eliminar'
          appearance='primary outline'
          disabled={newQuestion.id === null}
          onClick={() => setConfirmDeletion(true)}
        />
        <ShortButton
          buttonText={question ? 'Guardar Cambios' : 'Crear Pregunta'}
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
          ¿Seguro que quieres borrar la pregunta "{question?.text}"?
        </p>
        <footer>
          <ShortButton
            buttonText='Cancelar'
            appearance='secondary'
            onClick={() => setConfirmDeletion(false)}
          />
          <ShortButton
            buttonText='Eliminar Pregunta'
            isLoading={questionFetch.loading}
            onClick={handleDeletion}
          />
        </footer>
      </Modal>
    </>
  )
}
