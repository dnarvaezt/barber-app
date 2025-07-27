import { useMemo } from 'react'
import type { Client } from '../../application/domain/client'
import type { Employee } from '../../application/domain/employee'

export const useMockData = () => {
  const mockClients = useMemo<Record<string, Client>>(
    () => ({
      '1': {
        id: '1',
        name: 'Juan Pérez',
        phoneNumber: '+573001234567',
        birthDate: new Date('1990-05-15'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      '2': {
        id: '2',
        name: 'María García',
        phoneNumber: '+573001234568',
        birthDate: new Date('1985-08-22'),
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      '3': {
        id: '3',
        name: 'Carlos López',
        phoneNumber: '+573001234569',
        birthDate: new Date('1995-03-10'),
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      '4': {
        id: '4',
        name: 'Ana Rodríguez',
        phoneNumber: '+573001234570',
        birthDate: new Date('1988-12-05'),
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15'),
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      '5': {
        id: '5',
        name: 'Luis Martínez',
        phoneNumber: '+573001234571',
        birthDate: new Date('1992-07-18'),
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01'),
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    }),
    []
  )

  const mockEmployees = useMemo<Record<string, Employee>>(
    () => ({
      '1': {
        id: '1',
        name: 'Juan Pérez',
        phoneNumber: '+573001234567',
        birthDate: new Date('1990-05-15'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        createdBy: 'admin',
        updatedBy: 'admin',
        percentage: 25,
      },
      '2': {
        id: '2',
        name: 'María García',
        phoneNumber: '+573001234568',
        birthDate: new Date('1985-08-22'),
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        createdBy: 'admin',
        updatedBy: 'admin',
        percentage: 30,
      },
      '3': {
        id: '3',
        name: 'Carlos López',
        phoneNumber: '+573001234569',
        birthDate: new Date('1995-03-10'),
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
        createdBy: 'admin',
        updatedBy: 'admin',
        percentage: 20,
      },
      '4': {
        id: '4',
        name: 'Ana Rodríguez',
        phoneNumber: '+573001234570',
        birthDate: new Date('1988-12-05'),
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15'),
        createdBy: 'admin',
        updatedBy: 'admin',
        percentage: 35,
      },
      '5': {
        id: '5',
        name: 'Luis Martínez',
        phoneNumber: '+573001234571',
        birthDate: new Date('1992-07-18'),
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01'),
        createdBy: 'admin',
        updatedBy: 'admin',
        percentage: 28,
      },
    }),
    []
  )

  const mockClientsList = useMemo<Client[]>(
    () => [mockClients['1'], mockClients['2'], mockClients['3']],
    [mockClients]
  )

  const mockEmployeesList = useMemo<Employee[]>(
    () => [mockEmployees['1'], mockEmployees['2'], mockEmployees['3']],
    [mockEmployees]
  )

  // Funciones simples sin useCallback para evitar dependencias circulares
  const loadMockClient = async (id: string): Promise<Client | null> => {
    return mockClients[id] || null
  }

  const loadMockEmployee = async (id: string): Promise<Employee | null> => {
    return mockEmployees[id] || null
  }

  const loadMockClients = async (): Promise<Client[]> => {
    return mockClientsList
  }

  const loadMockEmployees = async (): Promise<Employee[]> => {
    return mockEmployeesList
  }

  return {
    mockClients,
    mockEmployees,
    mockClientsList,
    mockEmployeesList,
    loadMockClient,
    loadMockEmployee,
    loadMockClients,
    loadMockEmployees,
  }
}
