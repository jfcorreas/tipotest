import React, { useState, useEffect } from 'react'

import { useFetch } from '../hooks/useFetch'
import { Section } from '../containers/Section'
import { SelectableTable } from './SelectableTable'
import { FullButton } from './FullButton'
import { ShortButton } from './ShortButton'

export default function AdminTopics ({ apiUrl }) {
  const [topics, setTopics] = useState([])
  const [selectedTopicId, setSelectedTopicId] = useState(null)

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
          // setIsEditFormOpen(true)
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
          onClick={() => console.log(`Editando ${selectedTopicId}`)}
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
    </div>
  )
}
