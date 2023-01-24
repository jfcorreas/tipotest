import React, { useState, useEffect, useRef } from 'react'

import { Modal } from '../../containers/Modal'
import { Section } from '../../containers/Section'
import { TableWithSearch } from '../../containers/TableWithSearch'
import { useFetch } from '../../hooks/useFetch'
import { ApiProvider } from '../../providers/ApiProvider'
import { Select } from '../Select'
import { FullButton } from '../FullButton'
import { ShortButton } from '../ShortButton'
import { QuestionForm } from './QuestionForm'
import { ListOfAnswers } from '../ListOfAnswers'
import { QuestionAnswersForm } from './QuestionAnswersForm'
import { QuestionBatchForm } from './QuestionBatchForm'

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
  const [topicFilter, setTopicFilter] = useState('')
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isAnswersFormOpen, setIsAnswersFormOpen] = useState(false)
  const [isBatchFormOpen, setIsBatchFormOpen] = useState(false)

  const [questionsFetch, setQuestionsFetch] = useFetch()
  const [selectedQuestionFetch, setSelectedQuestionFetch] = useFetch()
  const [topicsFetch, setTopicsFetch] = useFetch()

  const pageRef = useRef(null)

  useEffect(() => {
    if (!isEditFormOpen && !isAnswersFormOpen && !isBatchFormOpen) {
      pageRef.current.focus()
      doRefresh()
    }
  }, [isEditFormOpen, isAnswersFormOpen, isBatchFormOpen])

  useEffect(() => {
    if (selectedQuestionId) {
      setSelectedQuestionFetch({
        apiUrl,
        path: 'questions',
        objectId: selectedQuestionId
      })
    }
  }, [selectedQuestionId])

  useEffect(() => {
    if (topicFilter) {
      setSelectedQuestionId(null)
      setQuestionsFetch({
        apiUrl,
        path: 'questions',
        filterParams: { topic: topicFilter }
      })
    } else {
      doRefresh()
    }
  }, [topicFilter])

  useEffect(() => {
    if (questionsFetch.data) {
      setQuestions(questionsFetch.data)
    }
  }, [questionsFetch.data])

  const doRefresh = () => {
    setQuestionsFetch({
      apiUrl,
      path: 'questions',
      filterParams: topicFilter ? { topic: topicFilter } : null
    })
    setTopicsFetch({
      apiUrl,
      path: 'topics'
    })
  }

  const handleKeyDown = (e) => {
    const keyName = e.key
    const ctrlKey = e.ctrlKey
    e.stopPropagation()
    if (keyName === 'Enter' && !isEditFormOpen && !isAnswersFormOpen && !isBatchFormOpen) {
      e.preventDefault()
      ctrlKey ? setIsAnswersFormOpen(true) : setIsEditFormOpen(true)
    }
    if (keyName === 'Escape' && !isEditFormOpen && !isAnswersFormOpen && !isBatchFormOpen) {
      setSelectedQuestionId(null)
      doRefresh()
    }
    if (keyName === 'Escape' && isEditFormOpen) setIsEditFormOpen(false)
    if (keyName === 'Escape' && isAnswersFormOpen) setIsAnswersFormOpen(false)
    if (keyName === 'Escape' && isBatchFormOpen) setIsBatchFormOpen(false)
  }

  // TODO: implement form to add questions and answers in batch
  return (
    <div ref={pageRef} onKeyDown={handleKeyDown} tabIndex='0'>
      <Select
        label='Tema'
        name='topic'
        type='text'
        placeholder='Filtrar por Tema'
        onChange={(e) => setTopicFilter(e.target.value)}
        isLoading={topicsFetch.loading}
        value={topicFilter}
      >
        {!topicFilter && <option value=''>Filtrar por Tema...</option>}
        {topicsFetch.data?.map((topic) => {
          return (
            <option key={topic._id} value={topic._id}>
              ({topic.shorthand}) {topic.title}
            </option>
          )
        })}
      </Select>
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
        <a onClick={() => { doRefresh() }}>🔁 Actualizar </a>
        <a onClick={() => { setTopicFilter('') }}>🆑 Limpiar Filtro</a>
        {questionsFetch.error && <div className='warning'>{questionsFetch.error}</div>}
        <TableWithSearch
          items={questions.map(question => (
            {
              _id: question._id,
              text: question.text,
              numAnswers: AnswersNum(question)
            }
          ))}
          placeholder='Filtro por texto...'
          itemProperties={{
            text: 'Texto',
            numAnswers: '#Respuestas'
          }}
          selectedId={selectedQuestionId}
          setSelectedId={setSelectedQuestionId}
        />
        <ShortButton
          buttonText='Editar Pregunta'
          appearance='secondary'
          disabled={!selectedQuestionId}
          onClick={() => setIsEditFormOpen(true)}
        />
        <ShortButton
          buttonText='Editar Respuestas'
          appearance='primary outline'
          disabled={!selectedQuestionId}
          onClick={() => setIsAnswersFormOpen(true)}
        />
      </Section>
      <div id='answersSection' className='grid'>
        <Section
          title='Tema'
          headingLevel={5}
          isLoading={selectedQuestionFetch.loading}
        >
          {selectedQuestionId && selectedQuestionFetch.data
            ? <p>{selectedQuestionFetch.data?.topic?.title}</p>
            : 'Seleccione una Pregunta ⬆️'}
        </Section>
        <Section
          title='Respuestas'
          headingLevel={5}
          isLoading={selectedQuestionFetch.loading}
        >
          <ListOfAnswers
            question={selectedQuestionId ? selectedQuestionFetch.data : null}
          />
        </Section>
      </div>
      <FullButton
        buttonText='Insertar Preguntas en Bloque'
        className='secondary outline'
        onClick={() => {
          setSelectedQuestionId(null)
          setIsBatchFormOpen(true)
        }}
      />
      <ApiProvider apiUrlDefault={apiUrl}>
        <Modal
          open={isEditFormOpen}
          handleClose={() => setIsEditFormOpen(!isEditFormOpen)}
          title={selectedQuestionId ? 'Editando Pregunta' : 'Nueva Pregunta'}
          subtitle={selectedQuestionId ? selectedQuestionFetch.data?.text : ''}
        >
          <QuestionForm
            question={selectedQuestionId ? selectedQuestionFetch.data : null}
            topicFilter={topicFilter}
            isActive={isEditFormOpen}
            closeActions={() => setIsEditFormOpen(!isEditFormOpen)}
            postSubmitActions={(questionId, topicId) => {
              setIsEditFormOpen(!isEditFormOpen)
              setSelectedQuestionId(questionId)
              setTopicFilter(topicId)
            }}
          />
        </Modal>
        <Modal
          open={isAnswersFormOpen}
          handleClose={() => setIsAnswersFormOpen(!isAnswersFormOpen)}
          title={`${selectedQuestionFetch.data?.text}:`}
        >
          <QuestionAnswersForm
            question={selectedQuestionId ? selectedQuestionFetch.data : null}
            isActive={isAnswersFormOpen}
            postSubmitActions={() => setIsAnswersFormOpen(!isAnswersFormOpen)}
          />
        </Modal>
        <Modal
          open={isBatchFormOpen}
          handleClose={() => setIsBatchFormOpen(!isBatchFormOpen)}
          title='Insertar Bloque de Preguntas'
        >
          <QuestionBatchForm
            topicFilter={topicFilter}
            isActive={isBatchFormOpen}
            postSubmitActions={() => setIsBatchFormOpen(!isBatchFormOpen)}
          />
        </Modal>
      </ApiProvider>
    </div>
  )
}
