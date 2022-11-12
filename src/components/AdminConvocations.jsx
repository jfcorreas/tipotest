import React, { useState, useEffect } from 'react'

import { fetchAPI } from '../services/apiClientServices'
import { SelectableTable } from './SelectableTable'
import { Section } from '../containers/Section'
import { FullButton } from './FullButton'
import { ShortButton } from './ShortButton'
import { ListOfTopics } from './ListOfTopics'
import { ConvocationForm } from './ConvocationForm'

export default function AdminConvocations ({ apiUrl }) {
  const [convocations, setConvocations] = useState([])
  const [selectedConvocationId, setSelectedConvocationId] = useState(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isEditFormOpen) doRefresh()
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

  return (
    <div>
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
        <a href='#' onClick={() => { doRefresh() }}>🔁 Actualizar</a>
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
          href='#edit'
          buttonText='Editar Convocatoria'
          appearance='secondary'
          disabled={!selectedConvocationId}
          onClick={() => setIsEditFormOpen(true)}
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
      <ConvocationForm
        apiUrl={apiUrl}
        open={isEditFormOpen}
        convocation={convocations.find(convocation => convocation._id === selectedConvocationId)}
        handleClose={() => setIsEditFormOpen(!isEditFormOpen)}
      />
    </div>
  )
}
