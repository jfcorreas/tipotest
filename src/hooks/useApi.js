import { useContext } from 'react'
import { apiContext } from '../apiContext'

export const useApi = () => useContext(apiContext)
