import React, { useState, useEffect, useRef } from 'react'

import { ApiProvider } from '../../providers/ApiProvider'
import { useFetch } from '../../hooks/useFetch'
import { Section } from '../../containers/Section'
import { Modal } from '../../containers/Modal'
import { SelectableTable } from '../SelectableTable'
import { FullButton } from '../FullButton'
import { ShortButton } from '../ShortButton'
import { ListOfTopics } from '../ListOfTopics'
import { ConvocationForm } from './ConvocationForm'
import { ConvocationTopicsForm } from './ConvocationTopicsForm'

export default function AdminConvocations ({ apiUrl }) {
  const [convocations, setConvocations] = useState([])
  const [selectedConvocationId, setSelectedConvocationId] = useState(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isTopicsFormOpen, setIsTopicsFormOpen] = useState(false)

  const [convocationsFetch, setConvocationsFetch] = useFetch()

  const pageRef = useRef(null)

  useEffect(() => {
    if (!isEditFormOpen && !isTopicsFormOpen) {
      pageRef.current.focus()
      doRefresh()
    }
  }, [isEditFormOpen, isTopicsFormOpen])

  useEffect(() => {
    setConvocations(convocationsFetch.data)
  }, [convocationsFetch.data])

  const doRefresh = () => {
    setSelectedConvocationId(null)
    setConvocationsFetch({
      apiUrl,
      path: 'convocations'
    })
  }

  const handleKeyDown = (e) => {
    const keyName = e.key

    if (keyName === 'Enter') setIsEditFormOpen(true)
    if (keyName === 'Escape' && !isEditFormOpen) doRefresh()
  }

  return (
    <div ref={pageRef} onKeyDown={handleKeyDown} tabIndex='0'>
      <FullButton
        buttonText='Nueva Convocatoria'
        className='primary'
        onClick={() => {
          setSelectedConvocationId(null)
          setIsEditFormOpen(true)
        }}
      />

      <Section
        title={`Convocatorias (${convocations.length})`}
        headingLevel={4}
        isLoading={convocationsFetch.loading}
      >
        <a onClick={() => { doRefresh() }}>🔁 Actualizar</a>
        {convocationsFetch.error && <div className='warning'>{convocationsFetch.error}</div>}
        <SelectableTable
          items={convocations}
          itemProperties={{
            name: 'Nombre',
            year: 'Año',
            institution: 'Administración',
            category: 'Categoría'
          }}
          selectedId={selectedConvocationId}
          setSelectedId={setSelectedConvocationId}
        />
        <ShortButton
          buttonText='Editar Convocatoria'
          appearance='secondary'
          disabled={!selectedConvocationId}
          onClick={() => setIsEditFormOpen(true)}
        />
        <ShortButton
          buttonText='Editar Temario'
          appearance='primary outline'
          disabled={!selectedConvocationId}
          onClick={() => setIsTopicsFormOpen(true)}
        />
      </Section>
      <Section
        title='Temario de la Convocatoria'
        headingLevel={5}
      >
        <ListOfTopics
          apiUrl={apiUrl}
          convocationId={selectedConvocationId}
          noTopicsText='Seleccione una Convocatoria ⬆️'
        />
      </Section>
      <ApiProvider apiUrlDefault={apiUrl}>
        <Modal
          open={isEditFormOpen}
          handleClose={() => setIsEditFormOpen(!isEditFormOpen)}
          title={selectedConvocationId ? 'Editando Convocatoria' : 'Nueva Convocatoria'}
          subtitle={
          selectedConvocationId &&
          convocations.find(convocation => convocation._id === selectedConvocationId).fullName
        }
        >
          <ConvocationForm
            convocation={convocations.find(convocation => convocation._id === selectedConvocationId)}
            isActive={isEditFormOpen}
            postSubmitActions={() => setIsEditFormOpen(!isEditFormOpen)}
          />
        </Modal>
        <Modal
          open={isTopicsFormOpen}
          handleClose={() => setIsTopicsFormOpen(!isTopicsFormOpen)}
          title='Temario de la Convocatoria'
          subtitle={
          selectedConvocationId &&
          convocations.find(convocation => convocation._id === selectedConvocationId).fullName
        }
        >
          <ConvocationTopicsForm
            convocationId={selectedConvocationId}
            isActive={isTopicsFormOpen}
            postSubmitActions={() => setIsTopicsFormOpen(!isTopicsFormOpen)}
          />
        </Modal>
      </ApiProvider>
    </div>
  )
}
