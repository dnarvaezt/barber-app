import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Space,
  Spin,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { PageContent } from '../../../components/layout/components'
import { useEmployeeForm } from './employee-form.hook'
import './employee-form.scss'

export const EmployeeForm = () => {
  const {
    loading,
    isValidating,
    isValidEmployee,
    isEditing,
    formData,
    showSuccessMessage,
    errors,
    handleSubmit,
    handleCancel,
    handleInputChange,
  } = useEmployeeForm()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  if (isValidating) {
    return (
      <PageContent>
        <Card style={{ width: '100%' }}>
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: 24 }}
          >
            <Spin tip='Validando empleado...' />
          </div>
        </Card>
      </PageContent>
    )
  }

  if (!isValidEmployee && isEditing) {
    return null
  }

  if (loading && isEditing) {
    return (
      <PageContent>
        <Card style={{ width: '100%' }}>
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: 24 }}
          >
            <Spin tip='Cargando empleado...' />
          </div>
        </Card>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <Card
        style={{ width: '100%' }}
        title={isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
      >
        <Typography.Paragraph type='secondary' style={{ marginTop: -8 }}>
          {isEditing
            ? 'Actualiza la información del empleado'
            : 'Completa la información para crear un nuevo empleado'}
        </Typography.Paragraph>

        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {showSuccessMessage && (
            <Alert
              showIcon
              type='success'
              message={
                isEditing
                  ? '¡Empleado actualizado exitosamente!'
                  : '¡Empleado creado exitosamente!'
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

              <Form.Item
                label='Porcentaje de comisión'
                required
                htmlFor='percentage'
                extra='Ingresa el porcentaje de comisión que recibirá el empleado (0-100%)'
              >
                <InputNumber
                  id='percentage'
                  size='large'
                  style={{ width: '100%' }}
                  value={
                    formData.percentage !== ''
                      ? Number.isNaN(Number(formData.percentage))
                        ? undefined
                        : Number(formData.percentage)
                      : undefined
                  }
                  onChange={value =>
                    handleInputChange(
                      'percentage',
                      value !== null && value !== undefined ? String(value) : ''
                    )
                  }
                  placeholder='Ej: 25'
                  min={0}
                  max={100}
                  step={0.01}
                  addonAfter='%'
                />
              </Form.Item>

              <Space style={{ width: '100%' }} wrap>
                <Button onClick={handleCancel}>Cancelar</Button>
                <Button htmlType='submit' type='primary' loading={loading}>
                  {isEditing ? 'Actualizar' : 'Crear'} Empleado
                </Button>
              </Space>
            </Form>
          </form>
        </Space>
      </Card>
    </PageContent>
  )
}
