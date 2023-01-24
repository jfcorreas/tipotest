import React, { useState, useEffect, useRef } from 'react'

import { ShortButton } from '../ShortButton'
import { Input } from '../Input'
import { useApi } from '../../hooks/useApi'
import { useFetch } from '../../hooks/useFetch'
import { Select } from '../Select'

export const QuestionBatchForm = ({
  topicFilter = null,
  isActive,
  closeActions,
  postSubmitActions
}) => {
  const [newQuestions, setNewQuestions] = useState([])
  const [questionsTopic, setQuestionsTopic] = useState(topicFilter)
  const [isValidForm, setIsValidForm] = useState(false)

  const [apiUrl] = useApi()

  // const [questionFetch, setQuestionFetch] = useFetch()
  const [topicsFetch, setTopicsFetch] = useFetch()

  const inputRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      inputRef.current.focus()
      setQuestionsTopic(topicFilter)
      setTopicsFetch({
        apiUrl,
        path: 'topics'
      })
    } else {
      setNewQuestions([])
      setQuestionsTopic(null)
    }
  }, [isActive])

  /*   useEffect(() => {
    if (isActive) {
      setNewQuestions([])
      // postSubmitActions(questionFetch.data._id || null, questionFetch.data.topic || '')
    }
  }, [questionFetch.data]) */

  const handleTopicChange = (e) => {
    const target = e.target
    const newTopicId = target.value

    setQuestionsTopic(newTopicId)

    setIsValidForm(!!newTopicId)
  }

  const handleSubmit = async () => {
    // TODO: handleSubmit Questions Batch
    /*     const options = {
      body: JSON.stringify(newQuestions),
      method: newQuestions.id ? 'PATCH' : 'POST'
    }
    setQuestionFetch({
      apiUrl,
      path: 'questions',
      objectId: newQuestions.id,
      options
    }) */
  }

  const handleKeyDown = (e) => {
    const keyName = e.key
    e.stopPropagation()
    if (keyName === 'Enter') {
      e.preventDefault();
      (isValidForm && handleSubmit())
    }
    if (keyName === 'Escape') closeActions()
  }

  return (
    <>
      <form onKeyDown={handleKeyDown}>
        <Input
          ref={inputRef}
          type='textarea'
          inputName='questions' label='Bloque de preguntas'
          placeholder='Pega aquí las preguntas con las respuestas...'
          isRequired
        />
        <Select
          selectName='topic' type='text' isRequired
          placeholder='Tema al que Corresponde la Pregunta'
          isValid={questionsTopic}
          isLoading={topicsFetch.loading}
          onChange={handleTopicChange}
          value={questionsTopic || ''}
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
      {/*      <p aria-busy={questionFetch.loading}>
        {questionFetch.loading && 'Aplicando cambios...'}
      </p>

      <p className='warning'>{questionFetch.error}</p> */}
      <footer>
        <ShortButton
          buttonText='Cancelar'
          appearance='secondary'
          onClick={postSubmitActions}
        />
        <ShortButton
          buttonText='Crear Preguntas'
          disabled={!isValidForm}
          onClick={handleSubmit}
        />
      </footer>
    </>
  )
}
