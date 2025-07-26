import { Icon } from '../icons'
import { useFooter } from './footer.hook'
import './footer.scss'

export const Footer = () => {
  const { links, appVersion } = useFooter()

  return (
    <footer className='footer'>
      <div className='footer__container'>
        <div className='footer__content'>
          <p className='footer__brand'>
            Andes Project <span className='footer__version'>v{appVersion}</span>
          </p>
          <div className='footer__links'>
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className='footer__link'
              >
                <Icon name={link.icon} className='footer__link-icon' />
                <span className='footer__link-text'>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
