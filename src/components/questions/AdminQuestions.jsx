import React, { useState, useEffect, useRef } from 'react'

import { useFetch } from '../../hooks/useFetch'
import { Section } from '../../containers/Section'
import { ShortButton } from '../ShortButton'
import { SelectableTable } from '../SelectableTable'

const AnswersNum = (question) => {
  return (
    <a href='#answersSection'>
      {question.answers.length} (
      {question.answers.filter((answer) => answer.isCorrect)
        .length > 0
        ? (
          <ins>
            {' '}
            {
                question.answers.filter(
                  (answer) => answer.isCorrect
                ).length
              }{' '}
          </ins>
          )
        : (
          <span className='warning'>Ninguna Correcta</span>
          )}
      )
    </a>
  )
}

export default function AdminQuestions ({ apiUrl }) {
  const [questions, setQuestions] = useState([])
  const [selectedQuestionId, setSelectedQuestionId] = useState(null)

  const [questionsFetch, setQuestionsFetch] = useFetch()

  useEffect(() => {
    doRefresh()
  }, [])

  useEffect(() => {
    setQuestions(questionsFetch.data)
  }, [questionsFetch.data])

  const doRefresh = () => {
    setSelectedQuestionId(null)
    setQuestionsFetch({
      apiUrl,
      path: 'questions'
    })
  }
  return (
    <div>
      <Section
        title={`Preguntas (${questions.length})`}
        headingLevel={4}
        isLoading={questionsFetch.loading}
      >
        <a onClick={() => { doRefresh() }}>🔁 Actualizar</a>
        {questionsFetch.error && <div className='warning'>{questionsFetch.error}</div>}
        <SelectableTable
          items={questions.map(question => (
            {
              _id: question._id,
              text: question.text,
              numAnswers: AnswersNum(question)
            }
          ))}
          itemProperties={{
            text: 'Texto',
            numAnswers: '#Respuestas'
          }}
          selectedId={selectedQuestionId}
          setSelectedId={setSelectedQuestionId}
        />
        <ShortButton
          buttonText='Editar Pregunta'
          appearance='primary outline'
          disabled={!selectedQuestionId}
          onClick={() => console.log('EDITARRR')}// setIsEditFormOpen(true)}
        />
      </Section>
    </div>
  )
}
