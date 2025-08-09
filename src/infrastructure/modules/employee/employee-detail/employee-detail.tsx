import {
  EditOutlined,
  MessageOutlined,
  PhoneOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Descriptions,
  Result,
  Space,
  Spin,
  Typography,
} from 'antd'
import { PageContent } from 'infrastructure/components/layout/components'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RouteIds, useRoutes } from '../../../routes'
import { useEmployeeDetail } from './employee-detail.hook'
import './employee-detail.scss'

export const EmployeeDetail = () => {
  const {
    loading,
    isValidating,
    isValidEmployee,
    employee,
    error,
    handleEdit,
    handleBack,
    formatDate,
    formatPhone,
    getAge,
    getBirthMonth,
  } = useEmployeeDetail()
  const { buildRoutePathWithParams } = useRoutes()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el employeeId
  if (isValidating) {
    return (
      <div className='employee-detail-page'>
        <div className='employee-detail-page__content'>
          <div className='employee-detail-page__center'>
            <Spin size='large' tip='Validando empleado...'>
              <div style={{ minHeight: 80 }} />
            </Spin>
          </div>
        </div>
      </div>
    )
  }

  // Si el employeeId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidEmployee) {
    return null
  }

  if (loading) {
    return (
      <div className='employee-detail-page'>
        <div className='employee-detail-page__content'>
          <div className='employee-detail-page__center'>
            <Spin size='large' tip='Cargando empleado...'>
              <div style={{ minHeight: 80 }} />
            </Spin>
          </div>
        </div>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className='employee-detail-page'>
        <div className='employee-detail-page__content'>
          <Result
            status='error'
            title='Error'
            subTitle={error || 'Empleado no encontrado'}
            extra={[
              <Button type='primary' key='back' onClick={handleBack}>
                Volver a la lista
              </Button>,
            ]}
          />
        </div>
      </div>
    )
  }

  return (
    <PageContent>
      <div className='employee-detail-page'>
        <div className='employee-detail-page__content'>
          <Space
            direction='vertical'
            size='middle'
            className='employee-detail-page__stack'
          >
            <Card
              size='small'
              title={
                <Typography.Title level={4}>
                  Información Personal
                </Typography.Title>
              }
            >
              <Descriptions
                size='small'
                column={{ xs: 1, sm: 1, md: 2 }}
                bordered={false}
              >
                <Descriptions.Item label='Nombre'>
                  <Typography.Text>{employee.name}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label='Teléfono'>
                  <a
                    href={`tel:${employee.phoneNumber}`}
                    className='employee-detail-page__phone-link'
                  >
                    {formatPhone(employee.phoneNumber)}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label='Fecha de Nacimiento'>
                  <Typography.Text>
                    {formatDate(employee.birthDate)} (
                    {getAge(employee.birthDate)} años)
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label='Mes de Cumpleaños'>
                  <Typography.Text>
                    {getBirthMonth(employee.birthDate)}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label='Porcentaje de Comisión'>
                  <Typography.Text strong>
                    {employee.percentage}%
                  </Typography.Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              size='small'
              title={
                <Typography.Title level={4}>
                  Información del Sistema
                </Typography.Title>
              }
            >
              <Descriptions size='small' column={{ xs: 1, sm: 1, md: 2 }}>
                <Descriptions.Item label='ID del Empleado'>
                  <Typography.Text code>{employee.id}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label='Fecha de Creación'>
                  <Typography.Text>
                    {formatDate(employee.createdAt)}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label='Última Actualización'>
                  <Typography.Text>
                    {formatDate(employee.updatedAt)}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label='Creado por'>
                  <Typography.Text>{employee.createdBy}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label='Actualizado por'>
                  <Typography.Text>{employee.updatedBy}</Typography.Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              size='small'
              title={<Typography.Title level={4}>Acciones</Typography.Title>}
            >
              <Space wrap className='employee-detail-page__actions'>
                <Button
                  type='primary'
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Editar Empleado
                </Button>
                <Button
                  icon={<PhoneOutlined />}
                  onClick={() =>
                    window.open(`tel:${employee.phoneNumber}`, '_self')
                  }
                >
                  Llamar
                </Button>
                <Button
                  icon={<MessageOutlined />}
                  onClick={() =>
                    window.open(
                      `https://wa.me/${employee.phoneNumber.replace('+', '')}`,
                      '_blank'
                    )
                  }
                >
                  WhatsApp
                </Button>
                <Link
                  to={buildRoutePathWithParams(
                    RouteIds.EMPLOYEE_SERVICE_HISTORY,
                    {
                      employeeId: employee.id,
                    }
                  )}
                >
                  <Button icon={<ProfileOutlined />}>
                    Historial de Servicios
                  </Button>
                </Link>
              </Space>
            </Card>
          </Space>
        </div>
      </div>
    </PageContent>
  )
}
