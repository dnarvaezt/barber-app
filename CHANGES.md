# Cambios Realizados para Configuración Dinámica de Rutas

## Problema Original

La aplicación tenía un `base: '/filter-docs/'` fijo en `vite.config.ts`, lo que causaba problemas:

- En desarrollo local: las rutas no funcionaban correctamente
- En GitHub Pages: las rutas funcionaban pero no eran dinámicas

## Solución Implementada

### 1. Configuración Dinámica de Vite (`vite.config.ts`)

- ✅ Base path dinámico basado en el modo de ejecución
- ✅ Variables globales definidas para el cliente
- ✅ Configuración de servidor mejorada para SPA

### 2. Sistema de Configuración de Entorno (`src/config/environment.ts`)

- ✅ Configuración centralizada del entorno
- ✅ Funciones helper para rutas absolutas
- ✅ Detección automática del entorno (desarrollo vs producción)

### 3. Router Personalizado (`src/components/Router.tsx`)

- ✅ BrowserRouter con basename dinámico
- ✅ Manejo automático del base path según el entorno

### 4. Hooks Personalizados (`src/hooks/useBasePath.ts`)

- ✅ Hook para obtener el base path actual
- ✅ Función para construir rutas absolutas
- ✅ Integración con la configuración de entorno

### 5. Scripts de Build (`package.json`)

- ✅ `build:gh-pages`: Build específico para GitHub Pages
- ✅ `deploy`: Build y deploy automático
- ✅ `homepage`: URL base configurada

### 6. Archivos de Soporte

- ✅ `404.html`: Página de error personalizada para GitHub Pages
- ✅ `_redirects`: Redirecciones para Netlify (futuro)
- ✅ Script de redirección en `index.html`

### 7. GitHub Actions (`.github/workflows/deploy.yml`)

- ✅ Deploy automático en push a main/master
- ✅ Build específico para GitHub Pages
- ✅ Configuración de cache para npm

## Cómo Funciona Ahora

### Desarrollo Local

```bash
npm start
# URL: http://localhost:3000
# Base Path: /
```

### GitHub Pages

```bash
npm run deploy
# URL: https://andesproject.github.io/filter-docs
# Base Path: /filter-docs/
```

## Archivos Modificados/Creados

### Nuevos Archivos

- `src/config/environment.ts`
- `src/components/Router.tsx`
- `src/hooks/useBasePath.ts`
- `src/hooks/index.ts`
- `public/404.html`
- `public/_redirects`
- `.github/workflows/deploy.yml`
- `DEPLOY.md`
- `CHANGES.md`

### Archivos Modificados

- `vite.config.ts`
- `package.json`
- `src/main.tsx`
- `src/app.tsx`
- `src/app.pages.tsx`
- `src/components/index.ts`
- `src/vite-env.d.ts`
- `index.html`

## Verificación

Para verificar que todo funciona:

1. **Desarrollo Local**:

   ```bash
   npm start
   # Visita http://localhost:3000
   ```

2. **GitHub Pages**:

   ```bash
   npm run deploy
   # Visita https://andesproject.github.io/filter-docs
   ```

3. **Build de Producción**:
   ```bash
   npm run build:gh-pages
   npm run preview
   # Visita http://localhost:4173
   ```

## Beneficios

- ✅ Rutas dinámicas que se adaptan automáticamente
- ✅ Desarrollo local sin problemas
- ✅ Deploy automático en GitHub Pages
- ✅ Configuración centralizada y mantenible
- ✅ Soporte para futuras migraciones (Netlify, etc.)
- ✅ Documentación completa del proceso

---

# Migración a GitHub Actions Pages (2025-07-25)

## Problema

Error de permisos en el workflow de despliegue:

```
ProcessError: remote: Permission to dnarvaezt/barber-app.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/dnarvaezt/barber-app.git/': The requested URL returned error: 403
```

## Solución Implementada

### 1. Migración de gh-pages a GitHub Actions Pages

- ✅ Eliminada dependencia `gh-pages`
- ✅ Actualizado workflow para usar `actions/deploy-pages@v4`
- ✅ Configuración de concurrencia para evitar despliegues simultáneos
- ✅ Separación de jobs de build y deploy

### 2. Workflow Actualizado (`.github/workflows/deploy.yml`)

- ✅ **Build Job:** Compila la aplicación y sube el artifact
- ✅ **Deploy Job:** Despliega usando GitHub Actions Pages
- ✅ **Concurrencia:** Controlada para evitar conflictos
- ✅ **Permisos:** Configurados correctamente para Pages

### 3. Scripts Simplificados (`package.json`)

- ✅ `deploy`: Ahora solo ejecuta el build local
- ✅ Eliminada dependencia `gh-pages`
- ✅ Mantenido `build:gh-pages` para compatibilidad

### 4. Documentación Actualizada (`DEPLOYMENT.md`)

- ✅ Instrucciones para configurar GitHub Pages
- ✅ Configuración de permisos requerida
- ✅ Notas sobre el nuevo sistema

## Configuración Requerida en GitHub

### 1. Habilitar GitHub Pages

- Settings > Pages > Source: "GitHub Actions"

### 2. Configurar Permisos

- Settings > Actions > General > Workflow permissions: "Read and write permissions"
- Settings > Actions > General > Allow GitHub Actions to create and approve pull requests: ✅

### 3. Verificar Entorno

- Settings > Environments > github-pages (se crea automáticamente)

## Beneficios de la Migración

- ✅ **Mayor Seguridad:** No requiere tokens de acceso personal
- ✅ **Mejor Control:** Concurrencia y permisos granulares
- ✅ **Menos Dependencias:** Eliminada gh-pages
- ✅ **Más Confiable:** Usa el sistema oficial de GitHub
- ✅ **Mejor Logging:** Logs más detallados en GitHub Actions

## Archivos Modificados

- `.github/workflows/deploy.yml` (completamente reescrito)
- `package.json` (eliminada gh-pages, simplificado deploy script)
- `DEPLOYMENT.md` (actualizada documentación)

## Verificación

1. **Push a main/master** debe disparar el workflow automáticamente
2. **Verificar en Actions** que el build y deploy sean exitosos
3. **Comprobar en Pages** que el sitio esté disponible en la URL configurada
