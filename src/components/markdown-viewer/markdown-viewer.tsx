import 'github-markdown-css'
import 'highlight.js/styles/atom-one-dark.css'
import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import './markdown-viewer.scss'
import { useMarkdownViewer } from './use-markdown-viewer'

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
  const { content, loading, error } = useMarkdownViewer({
    src,
    children,
    onLoad,
    onError,
  })

  // Agregar botones de copiar a los bloques de código
  useEffect(() => {
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('pre')

      codeBlocks.forEach(pre => {
        // Evitar agregar múltiples botones
        if (pre.querySelector('.copy-button')) return

        const code = pre.querySelector('code')
        if (!code) return

        const codeText = code.textContent || ''

        // Crear wrapper si no existe
        let wrapper = pre.parentElement
        if (!wrapper?.classList.contains('code-block-wrapper')) {
          wrapper = document.createElement('div')
          wrapper.className = 'code-block-wrapper'
          pre.parentNode?.insertBefore(wrapper, pre)
          wrapper.appendChild(pre)
        }

        // Crear botón de copiar
        const copyButton = document.createElement('button')
        copyButton.className = 'copy-button'
        copyButton.title = 'Copiar código'
        copyButton.setAttribute('aria-label', 'Copiar código al portapapeles')

        // Icono de copiar
        copyButton.innerHTML = `
          <svg class="copy-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        `

        // Función de copiar
        copyButton.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(codeText)

            // Cambiar icono a check
            copyButton.innerHTML = `
              <svg class="copy-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            `
            copyButton.classList.add('copied')
            copyButton.title = '¡Copiado!'

            // Restaurar después de 2 segundos
            setTimeout(() => {
              copyButton.innerHTML = `
                <svg class="copy-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              `
              copyButton.classList.remove('copied')
              copyButton.title = 'Copiar código'
            }, 2000)
          } catch (err) {
            console.error('Error al copiar:', err)
          }
        })

        wrapper.appendChild(copyButton)
      })
    }

    // Ejecutar después de que el contenido se renderice
    const timer = setTimeout(addCopyButtons, 100)

    return () => clearTimeout(timer)
  }, [content])

  // Componentes personalizados para ReactMarkdown
  const components = {}

  // Mostrar loading
  if (loading && showLoading) {
    return (
      <div className={`markdown-viewer ${className}`}>
        <div className='markdown-viewer__loading'>
          <div className='markdown-viewer__loading-content'>
            <div className='markdown-viewer__spinner'></div>
            <span className='markdown-viewer__loading-text'>Cargando...</span>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className={`markdown-viewer ${className}`}>
        <div className='markdown-viewer__error'>
          <div className='markdown-viewer__error-content'>
            <div className='markdown-viewer__error-icon'>
              <svg
                className='markdown-viewer__error-icon-svg'
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
            <div className='markdown-viewer__error-message'>
              <h3 className='markdown-viewer__error-title'>
                Error al cargar el archivo
              </h3>
              <div className='markdown-viewer__error-description'>{error}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar contenido Markdown
  return (
    <div className={`markdown-viewer ${className}`}>
      <div className={`markdown-viewer__container`}>
        <div className='markdown-viewer__markdown-body'>
          <div className='markdown-body'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
              components={components}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
