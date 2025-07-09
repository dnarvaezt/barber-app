import { findIconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import type { IconName } from '@fortawesome/fontawesome-svg-core'

library.add(fas, fab)

interface IconProps {
  name: string
  className?: string
  size?: 'xs' | 'sm' | 'lg' | 'xl' | '2xl'
}

export const Icon = ({ name, className, size = 'sm' }: IconProps) => {
  // Convertir el string a un objeto de icono
  const iconName = name
    .replace('fa-solid fa-', '')
    .replace('fa-brands fa-', '') as IconName
  const prefix = name.startsWith('fa-brands') ? 'fab' : 'fas'
  const iconDefinition = findIconDefinition({ prefix, iconName })

  if (!iconDefinition) return null

  return (
    <FontAwesomeIcon icon={iconDefinition} className={className} size={size} />
  )
}
