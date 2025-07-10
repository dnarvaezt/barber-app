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

/**
 * Componente para mostrar archivos Markdown en el browser
 * Soporta carga desde URL o contenido directo
 */
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

  // Cargar contenido desde URL
  useEffect(() => {
    if (!src) return

    const fetchMarkdown = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(src)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const markdownContent = await response.text()
        setContent(markdownContent)
        onLoad?.(markdownContent)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido'
        setError(errorMessage)
        onError?.(err instanceof Error ? err : new Error(errorMessage))
      } finally {
        setLoading(false)
      }
    }

    fetchMarkdown()
  }, [src, onLoad, onError])

  // Usar contenido directo si se proporciona
  useEffect(() => {
    if (children) {
      setContent(children)
      onLoad?.(children)
    }
  }, [children, onLoad])

  // Mostrar loading
  if (loading && showLoading) {
    return (
      <div className={`markdown-viewer loading ${className}`}>
        <div className='flex items-center justify-center p-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500'></div>
          <span className='ml-3 text-gray-600 font-medium'>Cargando...</span>
        </div>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className={`markdown-viewer error ${className}`}>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
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
              <h3 className='text-sm font-medium text-red-800'>
                Error al cargar el archivo
              </h3>
              <div className='mt-2 text-sm text-red-700'>{error}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar contenido Markdown
  return (
    <article
      className={`markdown-body bg-white text-gray-900 p-8 ${className}`}
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
