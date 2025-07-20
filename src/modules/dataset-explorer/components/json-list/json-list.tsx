import './json-list.scss'

export interface JSONListProps {
  className?: string
  items: any[]
}

interface JSONNodeProps {
  data: any
  level?: number
}

const JSONNode = ({ data, level = 0 }: JSONNodeProps) => {
  const isObject = (data: any): boolean => {
    return data !== null && typeof data === 'object'
  }

  const isArray = (data: any): boolean => {
    return Array.isArray(data)
  }

  const getDataKeys = (data: any): string[] => {
    return Object.keys(data)
  }

  const isEmpty = (data: any): boolean => {
    return getDataKeys(data).length === 0
  }

  const renderValue = (value: any): React.ReactNode => {
    if (value === null) return <span className='json-list__null'>null</span>
    if (typeof value === 'boolean')
      return <span className='json-list__boolean'>{String(value)}</span>
    if (typeof value === 'number')
      return <span className='json-list__number'>{value}</span>
    if (typeof value === 'string')
      return <span className='json-list__string'>"{value}"</span>
    return null
  }

  const renderKey = (key: string | number) => (
    <span className='json-list__key'>"{key}":</span>
  )

  if (!isObject(data)) {
    return <span className='json-list__value'>{renderValue(data)}</span>
  }

  const keys = getDataKeys(data)
  const dataIsEmpty = isEmpty(data)

  return (
    <div className='json-list__node'>
      <div className='json-list__header'>
        <span className='json-list__type'>
          {isArray(data) ? '[' : '{'}
          {dataIsEmpty && (isArray(data) ? ']' : '}')}
        </span>
      </div>

      {!dataIsEmpty && (
        <div className='json-list__children'>
          {keys.map(key => {
            const value = data[key]
            const isSimpleValue = !isObject(value)

            return (
              <div key={key} className='json-list__property'>
                <div className='json-list__property-header'>
                  {renderKey(key)}
                  {isSimpleValue && (
                    <span className='json-list__property-inline-value'>
                      {renderValue(value)}
                    </span>
                  )}
                </div>
                {!isSimpleValue && (
                  <div className='json-list__property-value'>
                    <JSONNode data={value} level={level + 1} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {!dataIsEmpty && (
        <div className='json-list__footer'>
          <span className='json-list__type'>{isArray(data) ? ']' : '}'}</span>
        </div>
      )}
    </div>
  )
}

export const JSONList = (props: JSONListProps) => {
  const { items, className } = props

  if (!items || items.length === 0) {
    return (
      <div className={`json-list ${className || ''}`}>
        <div className='json-list__empty'>No hay elementos para mostrar</div>
      </div>
    )
  }

  return (
    <div className={`json-list ${className || ''}`}>
      <div className='json-list__container'>
        {items.map((item, index) => (
          <div key={index} className='json-list__item'>
            <JSONNode data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}
