import { Layout as AntLayout, Col, Row, Space, Typography } from 'antd'
import { Icon } from '../../../icons'
import { useFooter } from './footer.hook'
import './footer.scss'

export const Footer = () => {
  const { links, appVersion } = useFooter()

  return (
    <AntLayout.Footer className='footer'>
      <div className='footer__container'>
        <Row
          className='footer__content'
          justify='space-between'
          align='middle'
          gutter={[8, 8]}
        >
          <Col xs={24} sm={12} className='footer__brand'>
            <Typography.Text className='footer__brand-text'>
              Andes Project{' '}
              <span className='footer__version'>v{appVersion}</span>
            </Typography.Text>
          </Col>
          <Col xs={24} sm={12} className='footer__links'>
            <Space size='middle' wrap>
              {links.map(link => (
                <Typography.Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={`footer__link ${link.external ? 'footer__link--external' : ''}`}
                >
                  <Icon name={link.icon} className='footer__link-icon' />
                  <span className='footer__link-text'>{link.label}</span>
                </Typography.Link>
              ))}
            </Space>
          </Col>
        </Row>
      </div>
    </AntLayout.Footer>
  )
}
