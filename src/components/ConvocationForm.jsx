import React, { useState, useEffect } from 'react'
import { ShortButton } from '../components/ShortButton'
import { Input } from './Input'

export const ConvocationForm = ({
  apiUrl,
  convocation,
  postSubmitActions
}) => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidForm, setIsValidForm] = useState(false)
  const [newConvocation, setNewConvocation] = useState(
    {
      id: convocation ? convocation._id : null,
      name: convocation ? convocation.name : null,
      year: convocation ? convocation.year : new Date().getFullYear(),
      institution: convocation ? convocation.institution : null,
      category: convocation ? convocation.category : null
    }
  )

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
    setNewConvocation(updatedConvocation)
  }

  return (
    <>
      <span className='warning'>{errorMessage}</span>
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
      <footer>
        <ShortButton
          buttonText='Cancelar'
          href='#cancel'
          appearance='secondary'
          onClick={postSubmitActions}
        />
        <ShortButton
          buttonText='Eliminar'
          href='#delete'
          appearance='primary outline'
          disabled={newConvocation.id === null}
          onClick={postSubmitActions}
        />
        <ShortButton
          buttonText={convocation ? 'Guardar Cambios' : 'Crear Convocatoria'}
          href='#confirm'
          disabled={!isValidForm}
          onClick={postSubmitActions}
        />

      </footer>
    </>
  )
}
