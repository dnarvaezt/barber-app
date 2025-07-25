# 💈 Barber App

Una aplicación web moderna para gestión de barberías construida con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Interfaz moderna y responsiva** con diseño adaptable
- **Sistema de temas** con múltiples variantes visuales
- **Arquitectura modular** siguiendo principios SOLID
- **Componentes reutilizables** con separación de responsabilidades
- **Sistema de rutas** con carga lazy para optimización
- **Documentación técnica** integrada
- **Sistema de iconos** personalizable
- **Layout responsive** con sidebar y header

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS + SCSS
- **Build Tool**: Vite
- **Linting**: ESLint
- **Iconos**: Sistema personalizado de iconos
- **Rutas**: React Router con lazy loading

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd barber-app
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**

   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── footer/         # Componente de pie de página
│   ├── header/         # Componente de encabezado
│   ├── icons/          # Sistema de iconos
│   ├── layout/         # Layout principal
│   ├── markdown-viewer/ # Visor de markdown
│   ├── side-bar/       # Barra lateral
│   └── theme/          # Sistema de temas
├── modules/            # Módulos de la aplicación
│   ├── home-page/      # Página principal
│   └── technical-documentation-page/ # Documentación técnica
├── routes/             # Configuración de rutas
├── hooks/              # Hooks personalizados
├── assets/             # Recursos estáticos
└── config/             # Configuraciones
```

## 🎨 Sistema de Temas

La aplicación incluye un sistema de temas avanzado que permite:

- **Múltiples variantes de diseño** predefinidas
- **Cambio dinámico** de temas en tiempo real
- **Componentes de selección** de temas
- **Debug visual** de componentes
- **Preview de diseños** antes de aplicar

### Uso del sistema de temas

```tsx
import { useTheme } from '@/components/theme'

function MyComponent() {
  const { currentTheme, setTheme } = useTheme()

  return (
    <div>
      <button onClick={() => setTheme('dark')}>Cambiar a tema oscuro</button>
    </div>
  )
}
```

## 🧩 Arquitectura de Componentes

### Estructura Obligatoria

Cada componente sigue una estructura estandarizada:

```
/component-name/
├── component-name.tsx    # Lógica y JSX
├── component-name.scss   # Estilos personalizados
├── component-name.hook.ts # Hook personalizado (si aplica)
└── index.ts             # Reexportación
```

### Principios de Diseño

- **Separación de responsabilidades**: Lógica en hooks, presentación en componentes
- **Estilos con Tailwind + SCSS**: Uso de `@apply` para clases reutilizables
- **Componentes desacoplados**: Sin dependencias externas innecesarias
- **Sistema BEM para cursores**: Control centralizado de interacciones

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción

# Linting y calidad
npm run lint         # Ejecuta ESLint
npm run lint:fix     # Corrige errores de linting automáticamente

# Análisis
npm run lighthouse   # Ejecuta análisis de performance
```

## 📱 Características Responsive

- **Mobile-first**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: Adaptación automática a diferentes tamaños de pantalla
- **Sidebar colapsible**: Navegación optimizada para móviles
- **Touch-friendly**: Interacciones optimizadas para pantallas táctiles

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_APP_TITLE=Barber App
VITE_API_URL=http://localhost:3000
```

### Configuración de Tailwind

El proyecto incluye configuración personalizada de Tailwind CSS con:

- **Temas personalizados** integrados
- **Variables CSS** para consistencia
- **Mixins SCSS** para reutilización
- **Sistema de colores** escalable

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm run test
npm run test:watch
npm run test:coverage
```

## 📦 Build y Despliegue

### Build de Producción

```bash
npm run build
```

Los archivos optimizados se generan en la carpeta `dist/`.

### Despliegue

La aplicación está configurada para desplegarse en:

- **Netlify**: Configuración automática con `_redirects`
- **Vercel**: Compatible con Vite
- **GitHub Pages**: Configuración incluida

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- **TypeScript**: Tipado estricto obligatorio
- **ESLint**: Reglas de linting configuradas
- **Prettier**: Formateo automático de código
- **Conventional Commits**: Estándar de mensajes de commit

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la [documentación técnica](./src/modules/technical-documentation-page/)
2. Abre un issue en el repositorio
3. Contacta al equipo de desarrollo

## 🗺️ Roadmap

- [ ] Sistema de autenticación
- [ ] Gestión de citas
- [ ] Panel de administración
- [ ] Integración con pasarelas de pago
- [ ] App móvil nativa
- [ ] Sistema de notificaciones push

---

**Desarrollado con ❤️ para la comunidad de barberos**
