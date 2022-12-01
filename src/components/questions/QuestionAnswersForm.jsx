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
  const [isValidForm, setIsValidForm] = useState(false)

  const [apiUrl] = useApi()

  const [answerFetch, setAnswerFetch] = useFetch()

  const inputRef = useRef(null)

  useEffect(() => {
    if (isActive && question) {
      inputRef.current.focus()
      setAnswers(question.answers)
    } else {
      setIsValidForm(false)
      setCurrentAnswer(emptyAnswer)
      setSelectedAnswerId(null)
    }
  }, [isActive])

  useEffect(() => {
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
      const newAnswers = [...answers]
      newAnswers.push(answerFetch.data)
      setAnswers(newAnswers)
      setIsValidForm(false)
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

    const invalidForm = !updatedAnswer.text

    setIsValidForm(!invalidForm)
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

  const handleKeyDown = (e) => {
    const keyName = e.key
    e.stopPropagation()
    if (keyName === 'Enter') {
      e.preventDefault()
      console.log('Enter')
    }
    if (keyName === 'Escape') {
      console.log('Escape')
    }
  }
  return (
    <>

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
      />
      <form onKeyDown={handleKeyDown}>
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
        </Section>
        <FullButton
          buttonText='Añadir Nueva Respuesta'
          className='primary outline'
          disabled={!currentAnswer.text}
          onClick={handleNewAnswer}
        />
      </form>

      <p className='warning'>{answerFetch.error}</p>
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
