import { useEffect, useState } from 'react'

interface UseMarkdownViewerProps {
  src?: string
  children?: string
  onLoad?: (content: string) => void
  onError?: (error: Error) => void
}

interface UseMarkdownViewerReturn {
  content: string
  loading: boolean
  error: string | null
}

export const useMarkdownViewer = ({
  src,
  children,
  onLoad,
  onError,
}: UseMarkdownViewerProps): UseMarkdownViewerReturn => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!src) {
      if (children) {
        setContent(children)
        onLoad?.(children)
      }
      return
    }

    setLoading(true)
    setError(null)

    fetch(src)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then(text => {
        setContent(text)
        onLoad?.(text)
      })
      .catch(err => {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido'
        setError(errorMessage)
        onError?.(err instanceof Error ? err : new Error(errorMessage))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [src, children, onLoad, onError])

  return {
    content,
    loading,
    error,
  }
}
