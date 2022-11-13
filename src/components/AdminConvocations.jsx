import React, { useState, useEffect, useRef } from 'react'

import { fetchAPI } from '../services/apiClientServices'
import { SelectableTable } from './SelectableTable'
import { Section } from '../containers/Section'
import { Modal } from '../containers/Modal'
import { FullButton } from './FullButton'
import { ShortButton } from './ShortButton'
import { ListOfTopics } from './ListOfTopics'
import { ConvocationForm } from './ConvocationForm'
import { ConvocationTopicsForm } from './ConvocationTopicsForm'

export default function AdminConvocations ({ apiUrl }) {
  const [convocations, setConvocations] = useState([])
  const [selectedConvocationId, setSelectedConvocationId] = useState(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isTopicsFormOpen, setIsTopicsFormOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const pageRef = useRef(null)

  useEffect(() => {
    if (!isEditFormOpen) {
      doRefresh()
      pageRef.current.focus()
    }
  }, [isEditFormOpen])

  const doRefresh = async () => {
    setErrorMessage(null)
    setSelectedConvocationId(null)
    setIsLoading(true)
    try {
      const result = await fetchAPI({
        apiUrl,
        path: 'convocations'
      })

      if (result?.status === 'FAILED') {
        setErrorMessage(result.data.error)
      } else {
        const convocations = result?.data ? result.data : []
        setConvocations(convocations)
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
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
        isLoading={isLoading}
      >
        <a onClick={() => { doRefresh() }}>🔁 Actualizar</a>
        {errorMessage && <div className='warning'>{errorMessage}</div>}
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
          apiUrl={apiUrl}
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
          apiUrl={apiUrl}
          convocationId={selectedConvocationId}
          isActive={isTopicsFormOpen}
          postSubmitActions={() => setIsTopicsFormOpen(!isTopicsFormOpen)}
        />
      </Modal>
    </div>
  )
}
