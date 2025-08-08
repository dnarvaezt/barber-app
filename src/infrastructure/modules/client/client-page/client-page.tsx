import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Button, Card, Input, Modal, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Client } from '../../../../application/domain/client'
import { Pagination, SortControls } from '../../../components'
import { PageContent } from '../../../components/layout/components'
import { RouteIds, useRoutes } from '../../../routes'
import { useClientPage } from './client-page.hook'
import './client-page.scss'

export const ClientPage = () => {
  const navigate = useNavigate()
  const { buildRoutePathWithParams } = useRoutes()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const {
    clients,
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
    deleteClient,
    formatDate,
    formatPhone,
    getMonthName,
  } = useClientPage()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  const handleDeleteClick = (clientId: string) => {
    setShowDeleteConfirm(clientId)
  }

  const handleConfirmDelete = async (clientId: string) => {
    try {
      await deleteClient(clientId)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('❌ Error deleting client:', error)
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

  const columns: ColumnsType<Client> = useMemo(
    () => [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
        sorter: false,
      },
      {
        title: 'Teléfono',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: (value: string) => formatPhone(value),
      },
      {
        title: 'Fecha de Nacimiento',
        dataIndex: 'birthDate',
        key: 'birthDate',
        render: (value: Date) => formatDate(value),
      },
      {
        title: 'Edad',
        key: 'age',
        render: (_: unknown, record: Client) => getAge(record.birthDate),
      },
      {
        title: 'Mes de Nacimiento',
        key: 'birthMonth',
        render: (_: unknown, record: Client) =>
          getMonthName(new Date(record.birthDate).getMonth()),
      },
      {
        title: 'Acciones',
        key: 'actions',
        render: (_: unknown, record: Client) => (
          <Space>
            <Link
              to={buildRoutePathWithParams(RouteIds.CLIENT_DETAIL, {
                clientId: record.id,
              })}
            >
              <Button size='small' icon={<EyeOutlined />}>
                Ver
              </Button>
            </Link>
            <Link
              to={buildRoutePathWithParams(RouteIds.CLIENT_FORM_EDIT, {
                clientId: record.id,
              })}
            >
              <Button size='small' icon={<EditOutlined />}>
                Editar
              </Button>
            </Link>
            <Button
              danger
              size='small'
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteClick(record.id)}
            >
              Eliminar
            </Button>
          </Space>
        ),
      },
    ],
    [buildRoutePathWithParams]
  )

  return (
    <PageContent>
      <div className='client-page'>
        <div className='client-page__content'>
          <div className='client-page__header'>
            <div className='client-page__header-content'>
              <Typography.Title level={2} className='client-page__title'>
                Gestión de Clientes
              </Typography.Title>
              <div className='client-page__header-actions'>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const newClientPath = buildRoutePathWithParams(
                      RouteIds.CLIENT_FORM_NEW,
                      {}
                    )
                    if (newClientPath) {
                      navigate(newClientPath)
                    }
                  }}
                >
                  Nuevo Cliente
                </Button>
              </div>
            </div>
          </div>

          <Card className='client-page__filters'>
            <Space direction='vertical' style={{ width: '100%' }} size='middle'>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  size='middle'
                  placeholder='Buscar clientes...'
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

              <div className='client-page__sort-section'>
                <SortControls
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  className='client-page__sort-controls'
                />
              </div>
            </Space>
          </Card>

          <div className='client-page__content'>
            <div className='client-page__table-container'>
              <Table<Client>
                rowKey='id'
                columns={columns}
                dataSource={clients}
                loading={loading}
                pagination={false}
              />
            </div>
          </div>

          <Card className='client-page__pagination'>
            <Pagination
              meta={meta}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              showLimitSelector={true}
            />
          </Card>

          <Modal
            title='Confirmar Eliminación'
            open={!!showDeleteConfirm}
            onOk={() =>
              showDeleteConfirm && handleConfirmDelete(showDeleteConfirm)
            }
            okText='Eliminar'
            okButtonProps={{ danger: true }}
            onCancel={handleCancelDelete}
            cancelText='Cancelar'
          >
            <Typography.Paragraph>
              ¿Estás seguro de que quieres eliminar este cliente?
            </Typography.Paragraph>
            <Typography.Paragraph type='secondary'>
              Esta acción no se puede deshacer.
            </Typography.Paragraph>
          </Modal>
        </div>
      </div>
    </PageContent>
  )
}
