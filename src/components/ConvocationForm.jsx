import React, { useState, useEffect } from 'react'

import { fetchAPI } from '../services/apiClientServices'
import { ShortButton } from '../components/ShortButton'
import { Input } from './Input'
import { Modal } from '../containers/Modal'

const emptyConvocation = {
  id: null,
  name: null,
  year: new Date().getFullYear(),
  institution: null,
  category: null
}

export const ConvocationForm = ({
  apiUrl,
  convocation,
  postSubmitActions
}) => {
  const [newConvocation, setNewConvocation] = useState(emptyConvocation)
  const [isValidForm, setIsValidForm] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const convocationProperties = {
    name: {
      required: true,
      type: 'text',
      label: 'Nombre',
      placeholder: 'Nombre de la Convocatoria'
    },
    year: {
      required: true,
      type: 'number',
      label: 'Año',
      placeholder: 'Año de la Convocatoria'
    },
    institution: {
      required: true,
      type: 'text',
      label: 'Administración',
      placeholder: 'Administración Convocante'
    },
    category: {
      required: true,
      type: 'text',
      label: 'Categoría',
      placeholder: 'Categoría Profesional'
    }
  }

  useEffect(() => {
    setNewConvocation(
      {
        id: convocation ? convocation._id : null,
        name: convocation ? convocation.name : null,
        year: convocation ? convocation.year : new Date().getFullYear(),
        institution: convocation ? convocation.institution : null,
        category: convocation ? convocation.category : null
      }
    )
    setErrorMessage(null)
    setIsLoading(false)
  }, [convocation])

  const handleInputChange = (e) => {
    const updatedConvocation = { ...newConvocation }
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const inputName = target.name

    if (inputName === 'year' && !value) {
      return
    }
    updatedConvocation[inputName] = value

    const invalidForm = (
      !updatedConvocation.name || !updatedConvocation.year ||
      !updatedConvocation.institution || !updatedConvocation.category
    )
    setIsValidForm(!invalidForm)
    setConfirmDeletion(false)
    setNewConvocation(updatedConvocation)
  }

  const handleSubmit = async () => {
    const options = {
      body: JSON.stringify(newConvocation),
      method: newConvocation.id ? 'PATCH' : 'POST'
    }
    setIsLoading(true)
    try {
      const result = await fetchAPI({
        apiUrl,
        path: 'convocations',
        objectId: newConvocation.id,
        options
      })

      if (result?.status === 'FAILED') {
        setErrorMessage(result.data.error)
      } else {
        setNewConvocation(emptyConvocation)
        postSubmitActions()
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletion = async () => {
    setIsLoading(true)
    try {
      const result = await fetchAPI({
        apiUrl,
        path: 'convocations',
        objectId: newConvocation.id,
        options: { method: 'DELETE' }
      })

      if (result?.status === 'FAILED') {
        setErrorMessage(result.data.error)
      } else {
        setNewConvocation(emptyConvocation)
        postSubmitActions()
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
      setConfirmDeletion(false)
    }
  }

  return (
    <>
      <form>
        {
        Object.entries(convocationProperties).map(([key, value]) => {
          return (
            <Input
              key={key}
              type={value.type}
              inputName={key} label={value.label}
              placeholder={value.placeholder}
              isRequired={value.required}
              isValid={(newConvocation[key] === null) ? null : newConvocation[key]}
              onChange={handleInputChange}
              value={newConvocation[key] || ''}
            />
          )
        })

        }
      </form>
      <p aria-busy={isLoading}>{isLoading && 'Aplicando cambios...'}</p>
      <p className='warning'>{errorMessage}</p>
      <footer>
        <ShortButton
          buttonText='Cancelar'
          appearance='secondary'
          onClick={postSubmitActions}
        />
        <ShortButton
          buttonText='Eliminar'
          appearance='primary outline'
          disabled={newConvocation.id === null}
          onClick={() => setConfirmDeletion(true)}
        />
        <ShortButton
          buttonText={convocation ? 'Guardar Cambios' : 'Crear Convocatoria'}
          disabled={!isValidForm}
          onClick={handleSubmit}
        />
      </footer>
      <Modal
        open={confirmDeletion}
        title='Atención'
        handleClose={() => setConfirmDeletion(false)}
      >
        <p>
          ¿Seguro que quieres borrar la convocatoria "{convocation?.fullName}"?
        </p>
        <footer>
          <ShortButton
            buttonText='Cancelar'
            appearance='secondary'
            onClick={() => setConfirmDeletion(false)}
          />
          <ShortButton
            buttonText='Eliminar Convocatoria'
            isLoading={isLoading}
            onClick={handleDeletion}
          />
        </footer>
      </Modal>
    </>
  )
}
