import React, { useState, useEffect, useRef } from 'react'

import { useFetch } from '../../hooks/useFetch'
import { Section } from '../../containers/Section'
import { ShortButton } from '../ShortButton'
import { SelectableTable } from '../SelectableTable'
import { QuestionForm } from './QuestionForm'
import { ApiProvider } from '../../providers/ApiProvider'
import { Modal } from '../../containers/Modal'
import { FullButton } from '../FullButton'

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
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)

  const [questionsFetch, setQuestionsFetch] = useFetch()

  useEffect(() => {
    if (!isEditFormOpen) {
      doRefresh()
    }
  }, [isEditFormOpen])

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
      <FullButton
        buttonText='Nueva Pregunta'
        className='primary'
        onClick={() => {
          setSelectedQuestionId(null)
          setIsEditFormOpen(true)
        }}
      />
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
          onClick={() => setIsEditFormOpen(true)}
        />
      </Section>

      <ApiProvider apiUrlDefault={apiUrl}>
        <Modal
          open={isEditFormOpen}
          handleClose={() => setIsEditFormOpen(!isEditFormOpen)}
          title={selectedQuestionId ? 'Editando Pregunta' : 'Nueva Pregunta'}
          subtitle={
          selectedQuestionId &&
          questions.find(question => question._id === selectedQuestionId).title
        }
        >
          <QuestionForm
            question={questions.find(question => question._id === selectedQuestionId)}
            isActive={isEditFormOpen}
            postSubmitActions={() => setIsEditFormOpen(!isEditFormOpen)}
          />
        </Modal>
      </ApiProvider>
    </div>
  )
}
