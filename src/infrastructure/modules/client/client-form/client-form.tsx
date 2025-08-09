import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Space,
  Spin,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { PageContent } from '../../../components/layout/components'
import { useClientForm } from './client-form.hook'
import './client-form.scss'

export const ClientForm = () => {
  const {
    loading,
    isValidating,
    isValidClient,
    isEditing,
    formData,
    showSuccessMessage,
    errors,
    handleSubmit,
    handleCancel,
    handleInputChange,
  } = useClientForm()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el clientId
  if (isValidating) {
    return (
      <PageContent>
        <Card style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <Spin tip='Validando cliente...' />
          </div>
        </Card>
      </PageContent>
    )
  }

  // Si el clientId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidClient && isEditing) {
    return null
  }

  if (loading && isEditing) {
    return (
      <PageContent>
        <Card style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <Spin tip='Cargando cliente...' />
          </div>
        </Card>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <Card
        style={{ width: '100%' }}
        title={isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        <Typography.Paragraph type='secondary' style={{ marginTop: -8 }}>
          {isEditing
            ? 'Actualiza la información del cliente'
            : 'Completa la información para crear un nuevo cliente'}
        </Typography.Paragraph>

        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {showSuccessMessage && (
            <Alert
              showIcon
              type='success'
              message={
                isEditing
                  ? '¡Cliente actualizado exitosamente!'
                  : '¡Cliente creado exitosamente!'
              }
            />
          )}

          {errors.general && (
            <Alert showIcon type='error' message={errors.general} />
          )}

          <form onSubmit={handleSubmit}>
            <Form layout='vertical' component={false}>
              <Form.Item label='Nombre completo' required htmlFor='name'>
                <Input
                  id='name'
                  size='large'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Ingresa el nombre completo'
                  allowClear
                  required
                />
              </Form.Item>

              <Form.Item
                label='Número de teléfono'
                required
                htmlFor='phoneNumber'
              >
                <Input
                  id='phoneNumber'
                  size='large'
                  type='tel'
                  value={formData.phoneNumber}
                  onChange={e =>
                    handleInputChange('phoneNumber', e.target.value)
                  }
                  placeholder='Ej: +57 300 123 4567'
                  allowClear
                  required
                />
              </Form.Item>

              <Form.Item
                label='Fecha de nacimiento'
                required
                htmlFor='birthDate'
              >
                <DatePicker
                  id='birthDate'
                  size='large'
                  style={{ width: '100%' }}
                  value={
                    formData.birthDate
                      ? dayjs(formData.birthDate, 'YYYY-MM-DD')
                      : null
                  }
                  onChange={d =>
                    handleInputChange(
                      'birthDate',
                      d ? d.format('YYYY-MM-DD') : ''
                    )
                  }
                  placeholder='Selecciona una fecha'
                  allowClear
                  inputReadOnly
                />
              </Form.Item>

              <Space style={{ width: '100%' }} wrap>
                <Button onClick={handleCancel}>Cancelar</Button>
                <Button htmlType='submit' type='primary' loading={loading}>
                  {isEditing ? 'Actualizar' : 'Crear'} Cliente
                </Button>
              </Space>
            </Form>
          </form>
        </Space>
      </Card>
    </PageContent>
  )
}
