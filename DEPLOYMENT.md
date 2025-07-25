# 🚀 Guía de Despliegue - GitHub Pages

## Configuración Actual

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages cuando se hace push a las ramas `main` o `master`.

### Requisitos Previos

1. **Habilitar GitHub Pages en el repositorio:**
   - Ve a Settings > Pages
   - En "Source", selecciona "GitHub Actions"
   - **Nota:** El workflow puede habilitarlo automáticamente con `enablement: true`

2. **Configurar permisos del repositorio:**
   - Ve a Settings > Actions > General
   - Asegúrate de que "Actions permissions" esté habilitado
   - En "Workflow permissions", selecciona "Read and write permissions"
   - Habilita "Allow GitHub Actions to create and approve pull requests"

### Workflow de Despliegue

El archivo `.github/workflows/deploy.yml` contiene:

- **Trigger:** Push a `main`/`master` y workflow_dispatch
- **Build:** Usa Node.js 22 y npm
- **Script:** `npm run build:gh-pages`
- **Despliegue:** Automático usando GitHub Actions Pages
- **Concurrencia:** Controlada para evitar despliegues simultáneos

### Configuración de Vite

El `vite.config.ts` está configurado para:

- Usar base path `/barber-app/` en producción
- Generar sourcemaps para debugging
- Optimizar chunks para mejor rendimiento

### Solución de Problemas

#### Error: "Get Pages site failed"

Si ves este error en el workflow:

```
##[error]Get Pages site failed. Please verify that the repository has Pages enabled
```

**Solución:**

1. El workflow ahora incluye `enablement: true` para habilitar Pages automáticamente
2. Verifica que GitHub Pages esté habilitado en Settings > Pages
3. Asegúrate de que el repositorio tenga permisos de Pages

#### Error: "Build directory 'dist' not found"

Si el build falla:

1. Verifica que `npm run build:gh-pages` funcione localmente
2. Revisa los logs del workflow para errores específicos
3. Asegúrate de que todas las dependencias estén instaladas

### URLs de Despliegue

- **Producción:** https://dnarvaezt.github.io/barber-app/
- **Desarrollo local:** http://localhost:3000

### Comandos Útiles

```bash
# Build para producción
npm run build:gh-pages

# Preview del build
npm run preview

# Despliegue manual (solo build local)
npm run deploy
```

### Notas Importantes

- El despliegue solo ocurre en pushes a `main`/`master`
- Los Pull Requests solo ejecutan el build, no el despliegue
- Los archivos de cursores personalizados están comentados temporalmente
- El build incluye optimizaciones para reducir el tamaño de los chunks
- **Nuevo:** Usa GitHub Actions Pages en lugar de gh-pages para mayor seguridad

### Configuración de GitHub Pages

El workflow está configurado para habilitar GitHub Pages automáticamente. Sin embargo, para una configuración manual:

1. **Habilitar GitHub Pages:**
   - Ve a Settings > Pages
   - En "Source", selecciona "GitHub Actions"
   - **Nota:** El workflow puede habilitarlo automáticamente con `enablement: true`

2. **Configurar permisos:**
   - Ve a Settings > Actions > General
   - En "Workflow permissions", selecciona "Read and write permissions"
   - Habilita "Allow GitHub Actions to create and approve pull requests"

3. **Verificar el entorno:**
   - Ve a Settings > Environments
   - Asegúrate de que existe el entorno "github-pages" (se crea automáticamente)

### Beneficios del Nuevo Sistema

- ✅ **Mayor Seguridad:** No requiere tokens de acceso personal
- ✅ **Mejor Control:** Concurrencia y permisos granulares
- ✅ **Menos Dependencias:** Eliminada gh-pages
- ✅ **Más Confiable:** Usa el sistema oficial de GitHub
- ✅ **Mejor Logging:** Logs más detallados en GitHub Actions
- ✅ **Habilitación Automática:** Pages se habilita automáticamente si no está configurado
