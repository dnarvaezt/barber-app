import './json-list.scss'

export interface JSONListProps {
  className?: string
  items: any[]
}

export const JSONList = (props: JSONListProps) => {
  const { items, className } = props

  const formatJSON = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2)
    } catch {
      return String(obj)
    }
  }

  const renderItem = (item: any, index: number) => {
    const formattedJSON = formatJSON(item)

    return (
      <div key={index} className='json-list__item'>
        <pre className='json-list__content'>
          <code>{formattedJSON}</code>
        </pre>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className={`json-list ${className}`}>
        <div className='json-list__empty'>No hay elementos para mostrar</div>
      </div>
    )
  }

  return (
    <div className={`json-list ${className}`}>
      <div className='json-list__container'>{items.map(renderItem)}</div>
    </div>
  )
}
