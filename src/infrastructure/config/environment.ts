export const config = {
  basePath: import.meta.env.DEV ? '/' : '/barber-app/',
  baseUrl: import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://dnarvaezt.github.io/barber-app',
  version: __APP_VERSION__ || '0.0.0',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

export const getAbsolutePath = (relativePath: string): string => {
  const normalizedPath = relativePath.startsWith('/')
    ? relativePath
    : `/${relativePath}`

  if (config.isDevelopment) {
    return normalizedPath
  }

  return `${config.basePath}${normalizedPath.slice(1)}`
}

export const getAbsoluteUrl = (relativePath: string): string => {
  const normalizedPath = relativePath.startsWith('/')
    ? relativePath
    : `/${relativePath}`

  if (config.isDevelopment) {
    return `${config.baseUrl}${normalizedPath}`
  }

  return `${config.baseUrl}${normalizedPath}`
}
