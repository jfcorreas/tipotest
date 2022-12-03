import React, { useState, useEffect, useRef } from 'react'

import { ShortButton } from '../ShortButton'
import { FullButton } from '../FullButton'
import { Input } from '../Input'
import { Section } from '../../containers/Section'
import { useApi } from '../../hooks/useApi'
import { useFetch } from '../../hooks/useFetch'
import { SelectableTable } from '../SelectableTable'

const emptyAnswer = {
  text: '',
  isCorrect: false
}

export const QuestionAnswersForm = ({
  question,
  isActive,
  postSubmitActions
}) => {
  const [answers, setAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState(emptyAnswer)
  const [selectedAnswerId, setSelectedAnswerId] = useState(null)
  const [userHasEdited, setUserHasEdited] = useState(false)

  const [apiUrl] = useApi()

  const [answerFetch, setAnswerFetch] = useFetch()

  const inputRef = useRef(null)

  useEffect(() => {
    setUserHasEdited(false)
    setCurrentAnswer(emptyAnswer)
    setSelectedAnswerId(null)
    if (isActive && question) {
      inputRef.current.focus()
      setAnswers(question.answers)
    }
  }, [isActive])

  useEffect(() => {
    setUserHasEdited(false)
    if (selectedAnswerId) {
      const selectedAnswer = answers.find((answer) => (
        answer._id === selectedAnswerId
      ))
      setCurrentAnswer(selectedAnswer)
    } else {
      setCurrentAnswer(emptyAnswer)
    }
  }, [selectedAnswerId])

  useEffect(() => {
    if (isActive) {
      let newAnswers = [...answers]
      if (answerFetch.method === 'POST') {
        const newAnswer = answerFetch.data
        newAnswers.push(newAnswer)
      }
      if (answerFetch.method === 'PATCH') {
        const modifiedAnswer = answerFetch.data
        const answerIndex = newAnswers.findIndex(answer => (
          answer._id === modifiedAnswer._id
        ))
        newAnswers.splice(answerIndex, 1, answerFetch.data)
      }
      if (answerFetch.method === 'DELETE') {
        const modifiedQuestion = answerFetch.data
        newAnswers = [...modifiedQuestion.answers]
      }
      setAnswers(newAnswers)
      setUserHasEdited(false)
      setCurrentAnswer(emptyAnswer)
      setSelectedAnswerId(null)
    }
  }, [answerFetch.data])

  const handleInputChange = (e) => {
    const updatedAnswer = { ...currentAnswer }
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const inputName = target.name

    updatedAnswer[inputName] = value

    setUserHasEdited(true)
    setCurrentAnswer(updatedAnswer)
  }

  const handleNewAnswer = (e) => {
    e.preventDefault()
    setAnswerFetch({
      apiUrl,
      path: 'questions',
      objectId: question._id,
      subpath: 'answers',
      options: {
        method: 'POST',
        body: JSON.stringify(currentAnswer)
      }
    })
  }

  const handleEditAnswer = (e) => {
    e.preventDefault()
    setAnswerFetch({
      apiUrl,
      path: 'questions',
      objectId: question._id,
      subpath: 'answers',
      subObjectId: currentAnswer._id,
      options: {
        method: 'PATCH',
        body: JSON.stringify(currentAnswer)
      }
    })
  }

  const handleDeleteAnswer = (e) => {
    e.preventDefault()
    setAnswerFetch({
      apiUrl,
      path: 'questions',
      objectId: question._id,
      subpath: 'answers',
      subObjectId: currentAnswer._id,
      options: { method: 'DELETE' }
    })
  }

  const handleKeyDown = (e) => {
    const keyName = e.key
    e.stopPropagation()
    if (keyName === 'Enter') {
      e.preventDefault()
      if (userHasEdited && currentAnswer.text) {
        selectedAnswerId ? handleEditAnswer(e) : handleNewAnswer(e)
      }
    }
    if (keyName === 'Escape') {
      postSubmitActions()
    }
  }

  return (
    <>
      <form onKeyDown={handleKeyDown}>
        <SelectableTable
          items={answers.map((answer) => {
            return {
              ...answer,
              isCorrect: answer.isCorrect ? '✅' : ''
            }
          })}
          itemProperties={{
            text: 'Texto de la respuesta',
            isCorrect: '¿Es correcta?'
          }}
          noHeader
          selectedId={selectedAnswerId}
          setSelectedId={setSelectedAnswerId}
          tabIndex='0'
        />

        <Section
          title='Edición de Repuestas:'
          headingLevel={4}
          isLoading={answerFetch.loading}
        >

          <Input
            ref={inputRef}
            name='text' type='text' required
            placeholder='Selecciona una Respuesta o escribe una nueva'
            aria-invalid={!currentAnswer.text}
            onChange={handleInputChange}
            value={currentAnswer.text}
          />
          <Input
            name='isCorrect' type='checkbox'
            label='¿Es una Respuesta correcta? '
            title='¿Es una Respuesta correcta?'
            onChange={handleInputChange}
            checked={currentAnswer.isCorrect}
          />
          <ShortButton
            buttonText='Modificar'
            appearance='contrast outline'
            disabled={!(userHasEdited && selectedAnswerId && currentAnswer.text)}
            onClick={handleEditAnswer}
          />
          <ShortButton
            buttonText='Eliminar'
            appearance='contrast'
            disabled={!selectedAnswerId}
            onClick={handleDeleteAnswer}
          />
        </Section>
        <p className='warning'>{answerFetch.error}</p>
        <FullButton
          buttonText='Añadir Nueva Respuesta'
          appearance='primary outline'
          disabled={!(userHasEdited && currentAnswer.text)}
          onClick={handleNewAnswer}
        />
      </form>

      <footer>
        <ShortButton
          buttonText='Terminar'
          appearance='secondary'
          onClick={postSubmitActions}
        />
      </footer>
    </>
  )
}
