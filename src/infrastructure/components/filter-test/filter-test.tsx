import { useEffect, useState } from 'react'
import { useSearchInput } from '../../hooks'
import { useMockData } from '../../hooks/use-mock-data.hook'
import { PaginationMockService } from '../../services/pagination-mock.service'
import './filter-test.scss'

export const FilterTest = () => {
  const { loadMockClients, loadMockEmployees } = useMockData()
  const [clients, setClients] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [filteredClients, setFilteredClients] = useState<any[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      const clientsData = await loadMockClients()
      const employeesData = await loadMockEmployees()
      setClients(clientsData)
      setEmployees(employeesData)
      setFilteredClients(clientsData)
      setFilteredEmployees(employeesData)
      setLoading(false)
    }
    loadData()
  }, [loadMockClients, loadMockEmployees])

  // Hook para búsqueda de clientes
  const clientSearch = useSearchInput({
    onSearch: value => {
      const results = PaginationMockService.searchWithPagination(
        clients,
        value,
        { page: 1, limit: 50 }
      )
      setFilteredClients(results.data)
    },
    debounceMs: 300,
  })

  // Hook para búsqueda de empleados
  const employeeSearch = useSearchInput({
    onSearch: value => {
      const results = PaginationMockService.searchWithPagination(
        employees,
        value,
        { page: 1, limit: 50 }
      )
      setFilteredEmployees(results.data)
    },
    debounceMs: 300,
  })

  if (loading) {
    return (
      <div className='filter-test-loading'>Cargando datos de prueba...</div>
    )
  }

  return (
    <div className='filter-test'>
      <h2>🧪 Prueba del Sistema de Filtros</h2>

      <div className='filter-test-section'>
        <h3>
          👥 Clientes ({filteredClients.length} de {clients.length})
        </h3>
        <div className='filter-test-search'>
          <input
            type='text'
            placeholder='Buscar clientes por nombre o teléfono... (Enter para buscar, Esc para limpiar)'
            value={clientSearch.searchValue}
            onChange={e => clientSearch.handleInputChange(e.target.value)}
            onKeyDown={clientSearch.handleKeyDown}
            className='filter-test-input'
          />
          {clientSearch.isSearching && (
            <div className='filter-test-loading-indicator'>🔍</div>
          )}
        </div>

        <div className='filter-test-results'>
          {filteredClients.map(client => (
            <div key={client.id} className='filter-test-item'>
              <strong>{client.name}</strong> - {client.phoneNumber}
              <br />
              <small>Nacimiento: {client.birthDate.toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>

      <div className='filter-test-section'>
        <h3>
          👨‍💼 Empleados ({filteredEmployees.length} de {employees.length})
        </h3>
        <div className='filter-test-search'>
          <input
            type='text'
            placeholder='Buscar empleados por nombre o teléfono... (Enter para buscar, Esc para limpiar)'
            value={employeeSearch.searchValue}
            onChange={e => employeeSearch.handleInputChange(e.target.value)}
            onKeyDown={employeeSearch.handleKeyDown}
            className='filter-test-input'
          />
          {employeeSearch.isSearching && (
            <div className='filter-test-loading-indicator'>🔍</div>
          )}
        </div>

        <div className='filter-test-results'>
          {filteredEmployees.map(employee => (
            <div key={employee.id} className='filter-test-item'>
              <strong>{employee.name}</strong> - {employee.phoneNumber}
              <br />
              <small>
                Nacimiento: {employee.birthDate.toLocaleDateString()} |
                Porcentaje: {employee.percentage}%
              </small>
            </div>
          ))}
        </div>
      </div>

      <div className='filter-test-instructions'>
        <h3>📋 Instrucciones de Prueba</h3>
        <ul>
          <li>
            <strong>Búsqueda por nombre:</strong> Prueba "Juan", "Pérez",
            "María"
          </li>
          <li>
            <strong>Búsqueda por teléfono:</strong> Prueba "300", "3001234567",
            "+573001234567"
          </li>
          <li>
            <strong>Búsqueda por nombre completo:</strong> Prueba "Juan Pérez"
          </li>
          <li>
            <strong>Búsqueda que no encuentra:</strong> Prueba "XYZ123"
          </li>
          <li>
            <strong>Limpieza:</strong> Presiona Escape o borra todo el texto
          </li>
          <li>
            <strong>Búsqueda inmediata:</strong> Presiona Enter
          </li>
        </ul>
      </div>

      <div className='filter-test-stats'>
        <h3>📊 Estadísticas</h3>
        <div className='filter-test-stats-grid'>
          <div className='filter-test-stat'>
            <strong>Total Clientes:</strong> {clients.length}
          </div>
          <div className='filter-test-stat'>
            <strong>Clientes Filtrados:</strong> {filteredClients.length}
          </div>
          <div className='filter-test-stat'>
            <strong>Total Empleados:</strong> {employees.length}
          </div>
          <div className='filter-test-stat'>
            <strong>Empleados Filtrados:</strong> {filteredEmployees.length}
          </div>
        </div>
      </div>
    </div>
  )
}
