import {
  EditOutlined,
  FileTextOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Descriptions,
  Grid,
  Result,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageContent } from '../../../components/layout/components/page-content'
import { RouteIds, useRoutes } from '../../../routes'
import { useClientDetail } from './client-detail.hook'
import './client-detail.scss'

export const ClientDetail = () => {
  const {
    loading,
    isValidating,
    isValidClient,
    client,
    error,
    handleEdit,
    handleBack,
    formatDate,
    formatPhone,
    getAge,
    getBirthMonth,
  } = useClientDetail()

  // Declarar hooks SIEMPRE al inicio del componente
  const { buildRoutePathWithParams } = useRoutes()
  const screens = Grid.useBreakpoint()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el clientId
  if (isValidating) {
    return (
      <PageContent>
        <div style={{ width: '100%' }}>
          <Spin tip='Validando cliente...' size='large'>
            <div style={{ minHeight: 120 }} />
          </Spin>
        </div>
      </PageContent>
    )
  }

  // Si el clientId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidClient) {
    return null
  }

  if (loading) {
    return (
      <PageContent>
        <div style={{ width: '100%' }}>
          <Spin tip='Cargando cliente...' size='large'>
            <div style={{ minHeight: 120 }} />
          </Spin>
        </div>
      </PageContent>
    )
  }

  if (error || !client) {
    return (
      <PageContent>
        <Result
          status='error'
          title='Error'
          subTitle={error || 'Cliente no encontrado'}
          extra={
            <Button
              type='primary'
              onClick={handleBack}
              icon={<FileTextOutlined />}
            >
              Volver a la lista
            </Button>
          }
        />
      </PageContent>
    )
  }

  // eliminado duplicado
  const { Title, Text } = Typography

  return (
    <PageContent>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              Información Personal
            </Title>
          }
        >
          <Descriptions
            size='small'
            column={{ xs: 1, sm: 1, md: 2, lg: 2 }}
            items={[
              {
                key: 'name',
                label: 'Nombre',
                children: <Text>{client.name}</Text>,
              },
              {
                key: 'phone',
                label: 'Teléfono',
                children: (
                  <a href={`tel:${client.phoneNumber}`}>
                    {formatPhone(client.phoneNumber)}
                  </a>
                ),
              },
              {
                key: 'birth',
                label: 'Fecha de Nacimiento',
                children: (
                  <Text>
                    {formatDate(client.birthDate)} ({getAge(client.birthDate)}{' '}
                    años)
                  </Text>
                ),
              },
              {
                key: 'month',
                label: 'Mes de Cumpleaños',
                children: <Text>{getBirthMonth(client.birthDate)}</Text>,
              },
            ]}
          />
        </Card>

        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              Información del Sistema
            </Title>
          }
        >
          <Descriptions
            size='small'
            column={{ xs: 1, sm: 1, md: 2, lg: 2 }}
            items={[
              {
                key: 'id',
                label: 'ID del Cliente',
                children: <Text code>{client.id}</Text>,
              },
              {
                key: 'createdAt',
                label: 'Fecha de Creación',
                children: <Text>{formatDate(client.createdAt)}</Text>,
              },
              {
                key: 'updatedAt',
                label: 'Última Actualización',
                children: <Text>{formatDate(client.updatedAt)}</Text>,
              },
              {
                key: 'createdBy',
                label: 'Creado por',
                children: <Text>{client.createdBy}</Text>,
              },
              {
                key: 'updatedBy',
                label: 'Actualizado por',
                children: <Text>{client.updatedBy}</Text>,
              },
            ]}
          />
        </Card>

        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              Acciones
            </Title>
          }
        >
          <Space
            direction={screens.md ? 'horizontal' : 'vertical'}
            style={{ width: '100%' }}
          >
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={handleEdit}
              block={!screens.md}
            >
              Editar Cliente
            </Button>
            <Button
              icon={<PhoneOutlined />}
              onClick={() => window.open(`tel:${client.phoneNumber}`, '_self')}
              block={!screens.md}
            >
              Llamar
            </Button>
            <Button
              icon={<WhatsAppOutlined />}
              onClick={() =>
                window.open(
                  `https://wa.me/${client.phoneNumber.replace('+', '')}`,
                  '_blank'
                )
              }
              block={!screens.md}
            >
              WhatsApp
            </Button>

            <Link
              to={buildRoutePathWithParams(RouteIds.CLIENT_INVOICES, {
                clientId: client.id,
              })}
            >
              <Button icon={<FileTextOutlined />}>Facturas del Cliente</Button>
            </Link>
          </Space>
        </Card>
      </Space>
    </PageContent>
  )
}
