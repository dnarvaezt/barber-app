import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Input, List, Modal, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pagination, SortControls } from '../../../components'
import { PageContent } from '../../../components/layout/components'
import { RouteIds, useRoutes } from '../../../routes'
import { useEmployeePage } from './employee-page.hook'
import './employee-page.scss'

export const EmployeePage = () => {
  const navigate = useNavigate()
  const { buildRoutePathWithParams } = useRoutes()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const {
    employees,
    loading,
    error,
    meta,
    searchTerm,
    sortBy,
    sortOrder,
    handleSearch,
    clearFilters,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    deleteEmployee,
    formatDate,
    formatPhone,
    getMonthName,
  } = useEmployeePage()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  const handleDeleteClick = (employeeId: string) => {
    setShowDeleteConfirm(employeeId)
  }

  const handleConfirmDelete = async (employeeId: string) => {
    try {
      await deleteEmployee(employeeId)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('❌ Error deleting employee:', error)
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  // Función para calcular la edad
  const getAge = (birthDate: Date) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--
    }

    return age
  }

  return (
    <PageContent>
      <div className='employee-page'>
        <div className='employee-page__content'>
          <div className='employee-page__header'>
            <div className='employee-page__header-content'>
              <Typography.Title level={2} className='employee-page__title'>
                Gestión de Empleados
              </Typography.Title>
              <div className='employee-page__header-actions'>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const newEmployeePath = buildRoutePathWithParams(
                      RouteIds.EMPLOYEE_FORM_NEW,
                      {}
                    )
                    if (newEmployeePath) {
                      navigate(newEmployeePath)
                    }
                  }}
                >
                  Nuevo Empleado
                </Button>
              </div>
            </div>
          </div>

          <Card className='employee-page__filters'>
            <Space direction='vertical' style={{ width: '100%' }} size='middle'>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder='Buscar empleados...'
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  allowClear
                  prefix={<SearchOutlined />}
                />
                {searchTerm && (
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      clearFilters()
                    }}
                  >
                    Limpiar
                  </Button>
                )}
              </Space.Compact>

              <div className='employee-page__sort-section'>
                <SortControls
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  className='employee-page__sort-controls'
                />
              </div>
            </Space>
          </Card>

          <div className='employee-page__content'>
            {loading ? (
              <Card className='employee-page__loading'>
                <div className='employee-page__loading-spinner'></div>
                <p>Cargando empleados...</p>
              </Card>
            ) : error ? (
              <Card className='employee-page__error'>
                <div className='employee-page__error-icon'>⚠️</div>
                <h3 className='employee-page__error-title'>Error</h3>
                <p className='employee-page__error-message'>{error}</p>
                <Button type='primary' onClick={() => window.location.reload()}>
                  Reintentar
                </Button>
              </Card>
            ) : employees.length === 0 ? (
              <Card className='employee-page__empty'>
                <p>No se encontraron empleados.</p>
              </Card>
            ) : (
              <>
                <Card className='employee-page__mobile-cards'>
                  <List
                    itemLayout='horizontal'
                    dataSource={employees}
                    rowKey='id'
                    renderItem={emp => {
                      const detailPath =
                        buildRoutePathWithParams(RouteIds.EMPLOYEE_DETAIL, {
                          employeeId: emp.id,
                        }) || '#'
                      const birth = new Date(emp.birthDate)
                      const day = String(birth.getDate()).padStart(2, '0')
                      const monthName = getMonthName(birth.getMonth())

                      return (
                        <List.Item
                          onClick={() => navigate(detailPath)}
                          role='link'
                          tabIndex={0}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              navigate(detailPath)
                            }
                          }}
                          className='employee-page__list-item'
                        >
                          <List.Item.Meta
                            title={
                              <Link
                                to={detailPath}
                                className='employee-page__list-link'
                              >
                                <span className='employee-page__employee-name'>
                                  {emp.name}
                                </span>
                              </Link>
                            }
                            description={
                              <span className='employee-page__list-subtitle'>
                                {formatPhone(emp.phoneNumber)} · {day}{' '}
                                {monthName}
                              </span>
                            }
                          />
                        </List.Item>
                      )
                    }}
                  />
                </Card>
              </>
            )}
          </div>

          <Pagination
            meta={meta}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            showLimitSelector={true}
            className='employee-page__pagination'
          />

          <Modal
            open={Boolean(showDeleteConfirm)}
            title='Confirmar Eliminación'
            onCancel={handleCancelDelete}
            onOk={() =>
              showDeleteConfirm && handleConfirmDelete(showDeleteConfirm)
            }
            okText='Eliminar'
            okButtonProps={{ danger: true }}
            cancelText='Cancelar'
          >
            <Space direction='vertical' size='small'>
              <Typography.Text>
                ¿Estás seguro de que quieres eliminar este empleado?
              </Typography.Text>
              <Typography.Text type='secondary'>
                Esta acción no se puede deshacer.
              </Typography.Text>
            </Space>
          </Modal>
        </div>
      </div>
    </PageContent>
  )
}
