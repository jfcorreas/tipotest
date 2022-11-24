import React, { useState, useEffect, useRef } from 'react'

import { ShortButton } from '../ShortButton'
import { Input } from '../Input'
import { Modal } from '../../containers/Modal'
import { useApi } from '../../hooks/useApi'
import { useFetch } from '../../hooks/useFetch'

const emptyConvocation = {
  id: null,
  name: null,
  year: new Date().getFullYear(),
  institution: null,
  category: null
}

export const ConvocationForm = ({
  convocation,
  isActive,
  postSubmitActions
}) => {
  const [newConvocation, setNewConvocation] = useState(emptyConvocation)
  const [isValidForm, setIsValidForm] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(false)

  const [apiUrl] = useApi()

  const [convocationFetch, setConvocationFetch] = useFetch()

  const inputRef = useRef(null)
  const confirmDeletionRef = useRef(null)

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
    inputRef.current.focus()
  }, [isActive])

  useEffect(() => {
    if (isActive) {
      setNewConvocation(emptyConvocation)
      setConfirmDeletion(false)
      postSubmitActions()
    }
  }, [convocationFetch.data])

  useEffect(() => {
    if (isActive) {
      confirmDeletion ? confirmDeletionRef.current.focus() : inputRef.current.focus()
    }
  }, [confirmDeletion])

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
    setConvocationFetch({
      apiUrl,
      path: 'convocations',
      objectId: newConvocation.id,
      options
    })
  }

  const handleDeletion = async () => {
    setConvocationFetch({
      apiUrl,
      path: 'convocations',
      objectId: newConvocation.id,
      options: { method: 'DELETE' }
    })
  }

  const handleKeyDown = (e) => {
    const keyName = e.key
    e.stopPropagation()
    if (keyName === 'Enter') {
      e.preventDefault()
      confirmDeletion ? handleDeletion() : handleSubmit()
    }
    if (keyName === 'Escape') {
      confirmDeletion ? setConfirmDeletion(false) : postSubmitActions()
    }
  }

  const convocationInputProperties = {
    name: {
      required: true, type: 'text', label: 'Nombre', placeholder: 'Nombre de la Convocatoria', ref: inputRef
    },
    year: {
      required: true, type: 'number', label: 'Año', placeholder: 'Año de la Convocatoria'
    },
    institution: {
      required: true, type: 'text', label: 'Administración', placeholder: 'Administración Convocante'
    },
    category: {
      required: true, type: 'text', label: 'Categoría', placeholder: 'Categoría Profesional'
    }
  }

  return (
    <>
      <form onKeyDown={handleKeyDown}>
        {
        Object.entries(convocationInputProperties).map(([key, value]) => {
          return (
            <Input
              key={key}
              ref={value.ref}
              type={value.type}
              inputName={key} label={value.label}
              placeholder={value.placeholder}
              isRequired={value.required}
              isValid={
                ((newConvocation[key] === null) || (convocation && newConvocation[key] === convocation[key]))
                  ? null
                  : newConvocation[key]
              }
              onChange={handleInputChange}
              value={newConvocation[key] || ''}
            />
          )
        })

        }
      </form>
      {
        !confirmDeletion &&
          <p aria-busy={convocationFetch.loading}>
            {convocationFetch.loading && 'Aplicando cambios...'}
          </p>
      }
      <p className='warning'>{convocationFetch.error}</p>
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
        ref={confirmDeletionRef}
        handleKeyDown={handleKeyDown}
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
            isLoading={convocationFetch.loading}
            onClick={handleDeletion}
          />
        </footer>
      </Modal>
    </>
  )
}
