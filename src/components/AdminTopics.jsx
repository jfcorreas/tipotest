import React, { useState, useEffect } from 'react'

import { useFetch } from '../hooks/useFetch'
import { ApiProvider } from '../providers/ApiProvider'
import { Section } from '../containers/Section'
import { Modal } from '../containers/Modal'
import { SelectableTable } from './SelectableTable'
import { FullButton } from './FullButton'
import { ShortButton } from './ShortButton'
import { TopicForm } from './TopicForm'

export default function AdminTopics ({ apiUrl }) {
  const [topics, setTopics] = useState([])
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)

  const [topicsFetch, setTopicsFetch] = useFetch()

  useEffect(() => {
    doRefresh()
  }, [])

  useEffect(() => {
    setTopics(topicsFetch.data)
  }, [topicsFetch.data])

  const doRefresh = () => {
    setSelectedTopicId(null)
    setTopicsFetch({
      apiUrl,
      path: 'topics'
    })
  }

  return (
    <div>
      {/* <div ref={pageRef} onKeyDown={handleKeyDown} tabIndex='0'> */}
      <FullButton
        buttonText='Nuevo Tema'
        className='primary'
        onClick={() => {
          setSelectedTopicId(null)
          setIsEditFormOpen(true)
        }}
      />
      <Section
        title={`Temas (${topics.length})`}
        headingLevel={4}
        isLoading={topicsFetch.loading}
      >
        <a onClick={() => { doRefresh() }}>🔁 Actualizar</a>
        {topicsFetch.error && <div className='warning'>{topicsFetch.error}</div>}
        <SelectableTable
          items={topics}
          itemProperties={{
            shorthand: 'Abreviatura',
            title: 'Título'
          }}
          selectedId={selectedTopicId}
          setSelectedId={setSelectedTopicId}
        />
        <ShortButton
          buttonText='Editar Tema'
          appearance='primary outline'
          disabled={!selectedTopicId}
          onClick={() => setIsEditFormOpen(true)}
        />
      </Section>
      <Section
        title='Título Completo'
        headingLevel={5}
      >
        <p className='texto'>
          {selectedTopicId
            ? topics.find(topic => topic._id === selectedTopicId).fullTitle
            : 'Seleccione un Tema ⬆️'}
        </p>
      </Section>
      <ApiProvider apiUrlDefault={apiUrl}>
        <Modal
          open={isEditFormOpen}
          handleClose={() => setIsEditFormOpen(!isEditFormOpen)}
          title={selectedTopicId ? 'Editando Tema' : 'Nuevo Tema'}
          subtitle={
          selectedTopicId &&
          topics.find(topic => topic._id === selectedTopicId).title
        }
        >
          <TopicForm
            topic={topics.find(topic => topic._id === selectedTopicId)}
            isActive={isEditFormOpen}
            postSubmitActions={() => setIsEditFormOpen(!isEditFormOpen)}
          />
        </Modal>
      </ApiProvider>
    </div>
  )
}
