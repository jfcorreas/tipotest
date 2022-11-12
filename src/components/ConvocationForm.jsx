import React, { useState, useEffect } from 'react'
import { ShortButton } from '../components/ShortButton'

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
      name: convocation ? convocation.name : null,
      year: convocation ? convocation.year : new Date().getFullYear(),
      institution: convocation ? convocation.institution : null,
      category: convocation ? convocation.category : null
    }
  )

  useEffect(() => {
    setNewConvocation(
      {
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
      !updatedConvocation.name ||
      !updatedConvocation.year ||
      !updatedConvocation.institution ||
      !updatedConvocation.category
    )
    setIsValidForm(!invalidForm)
    setNewConvocation(updatedConvocation)
  }

  return (
    <>
      <span className='warning'>{errorMessage}</span>
      <form>
        <label>
          Nombre
          <input
            name='name' type='text' required
            placeholder='Nombre de la Convocatoria'
            aria-invalid={(newConvocation.name === null) ? null : !newConvocation.name}
            onChange={handleInputChange}
            value={newConvocation.name || ''}
          />
        </label>
        <label>
          Año
          <input
            name='year' type='number' required
            placeholder='Año de la Convocatoria'
            aria-invalid={(newConvocation.year === null) ? null : !newConvocation.year}
            onChange={handleInputChange}
            value={newConvocation.year}
          />
        </label>
        <label>
          Administración
          <input
            name='institution' type='text' required
            placeholder='Administración convocante'
            aria-invalid={(newConvocation.institution === null) ? null : !newConvocation.institution}
            onChange={handleInputChange}
            value={newConvocation.institution || ''}
          />
        </label>
        <label>
          Categoría
          <input
            name='category' type='text' required
            placeholder='Categoría profesional'
            aria-invalid={(newConvocation.category === null) ? null : !newConvocation.category}
            onChange={handleInputChange}
            value={newConvocation.category || ''}
          />
        </label>
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
          disabled={convocation === null}
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
