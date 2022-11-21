import React, { useState, useEffect } from 'react'

import { Section } from '../containers/Section'
import { useFetch } from '../hooks/useFetch'
import { SelectableTable } from './SelectableTable'

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
      </Section>
    </div>
  )
}
