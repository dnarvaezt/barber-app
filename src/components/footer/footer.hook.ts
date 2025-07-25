import { useMemo } from 'react'

interface FooterLink {
  href: string
  label: string
  icon: string
  external?: boolean
}

export const useFooter = () => {
  const links = useMemo<FooterLink[]>(
    () => [
      {
        href: 'https://github.com/dnarvaezt/barber-app',
        label: 'GitHub',
        icon: 'fa-brands fa-github',
        external: true,
      },
    ],
    []
  )

  const appVersion = useMemo(() => __APP_VERSION__, [])

  return {
    links,
    appVersion,
  }
}
