import { findIconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { IconName } from '@fortawesome/fontawesome-svg-core';
// Importar todos los iconos globalmente
library.add(fas, fab);

const Icon = ({ name }: { name: string }) => {
  // Convertir el string a un objeto de icono
  const iconName = name
    .replace('fa-solid fa-', '')
    .replace('fa-brands fa-', '') as IconName;
  const prefix = name.startsWith('fa-brands') ? 'fab' : 'fas';
  const iconDefinition = findIconDefinition({ prefix, iconName });

  if (!iconDefinition) return null;

  return <FontAwesomeIcon icon={iconDefinition} />;
};

export default Icon;
