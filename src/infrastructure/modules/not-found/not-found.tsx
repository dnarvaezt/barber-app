import { ArrowLeftOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Grid, Result, Space } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { PageContent } from '../../components/layout/components/page-content'
import { RouteIds, useRoutes } from '../../routes'
import './not-found.scss'

export const NotFoundPage = () => {
  const navigate = useNavigate()
  const { getRoutePathById } = useRoutes()
  const screens = Grid.useBreakpoint()

  const clientListPath = getRoutePathById(RouteIds.CLIENT)

  return (
    <PageContent>
      <div className='not-found-page'>
        <Result
          status='404'
          title='Página No Encontrada'
          subTitle='Lo sentimos, la página que buscas no existe o ha sido movida.'
          className='not-found-page__result'
          extra={
            <Space size='middle' wrap>
              <Button
                onClick={() => window.history.back()}
                icon={<ArrowLeftOutlined />}
                size={screens.md ? 'middle' : 'large'}
                block={!screens.md}
              >
                Volver
              </Button>
              {clientListPath ? (
                <Link to={clientListPath}>
                  <Button
                    type='primary'
                    icon={<TeamOutlined />}
                    size={screens.md ? 'middle' : 'large'}
                    block={!screens.md}
                  >
                    Ir a Clientes
                  </Button>
                </Link>
              ) : (
                <Button
                  type='primary'
                  onClick={() => {
                    const path = getRoutePathById(RouteIds.CLIENT)
                    if (path) {
                      navigate(path)
                    }
                  }}
                  icon={<TeamOutlined />}
                  size={screens.md ? 'middle' : 'large'}
                  block={!screens.md}
                >
                  Ir a Clientes
                </Button>
              )}
            </Space>
          }
        />
      </div>
    </PageContent>
  )
}
