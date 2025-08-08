import type { PageContentProps } from './page-content.interface'
import './page-content.scss'

export const PageContent = (props: PageContentProps) => {
  const { children, className, style } = props

  const getClassList = () => {
    const classList = ['page-content']

    if (className) {
      classList.push(className)
    }

    return classList.join(' ')
  }

  return (
    <div className={getClassList()} style={style}>
      <div className='page-content__container'>{children}</div>
    </div>
  )
}
