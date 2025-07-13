import 'github-markdown-css'
import 'highlight.js/styles/atom-one-dark.css'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

interface MarkdownViewerProps {
  /** URL del archivo Markdown a cargar */
  src?: string
  /** Contenido Markdown directo */
  children?: string
  /** Clases CSS adicionales */
  className?: string
  /** Callback cuando se carga el contenido */
  onLoad?: (content: string) => void
  /** Callback cuando hay un error */
  onError?: (error: Error) => void
  /** Mostrar loading state */
  showLoading?: boolean
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  src,
  children,
  className = '',
  onLoad,
  onError,
  showLoading = true,
}) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar contenido desde URL si se proporciona
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

  // Mostrar loading
  if (loading && showLoading) {
    return (
      <div className={`markdown-viewer loading ${className}`}>
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-600'>
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            <span className='ml-3 text-gray-600 dark:text-gray-400'>
              Cargando...
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className={`markdown-viewer error ${className}`}>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 dark:bg-red-900/20 dark:border-red-800'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-red-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800 dark:text-red-200'>
                Error al cargar el archivo
              </h3>
              <div className='mt-2 text-sm text-red-700 dark:text-red-300'>
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar contenido Markdown
  return (
    <article
      className={`markdown-body bg-white text-gray-900 p-8 dark:bg-gray-800 dark:text-gray-200 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{}}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
