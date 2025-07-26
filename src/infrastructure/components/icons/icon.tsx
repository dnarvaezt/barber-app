import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import type { IconSize } from './icon.constants'
import { useIcon } from './icon.hook'

export interface IconProps {
  name: string
  className?: string
  size?: IconSize
}

// Componente principal del icono
export const Icon = ({ name, className, size = 'sm' }: IconProps) => {
  const { iconDefinition, isValid } = useIcon(name)

  if (!isValid || !iconDefinition) {
    return null
  }

  return (
    <FontAwesomeIcon icon={iconDefinition} className={className} size={size} />
  )
}
