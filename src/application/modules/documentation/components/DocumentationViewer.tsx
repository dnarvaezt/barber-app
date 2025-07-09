import './DocumentationViewer.scss'
import React, { useEffect, useState } from 'react'
import { getAllDocumentationFiles, getDocumentationFile } from '../data/documentation'
import MarkdownViewer from './MarkdownViewer'

import type { DocFile } from '../data/documentation'
interface DocumentationViewerProps {
  className?: string;
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ className = '' }) => {
  const [currentDoc, setCurrentDoc] = useState<string>('README');
  const [documents] = useState<DocFile[]>(getAllDocumentationFiles());
  const [currentContent, setCurrentContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load markdown content
  const loadMarkdownContent = (docId: string) => {
    setIsLoading(true);
    try {
      const doc = getDocumentationFile(docId);
      if (doc) {
        setCurrentContent(doc.content);
      } else {
        setCurrentContent('# Error\nDocumento no encontrado.');
      }
    } catch (error) {
      console.error('Error loading markdown:', error);
      setCurrentContent('# Error\nNo se pudo cargar la documentación.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document change
  const handleDocChange = (docId: string) => {
    setCurrentDoc(docId);
    loadMarkdownContent(docId);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  // Load initial content
  useEffect(() => {
    loadMarkdownContent(currentDoc);
  }, []);

  return (
    <div className={`documentation-viewer ${className}`}>
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar */}
      <aside className={`documentation-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Documentación</h2>
          <button
            className="close-sidebar-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                <button
                  className={`nav-item ${currentDoc === doc.id ? 'active' : ''}`}
                  onClick={() => handleDocChange(doc.id)}
                >
                  {doc.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="version-info">
            <span className="version-badge">v1.0.1</span>
            <span className="version-text">@andes-project/filter</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="documentation-main">
        <div className="content-header">
          <h1>{documents.find(d => d.id === currentDoc)?.title}</h1>
          <div className="breadcrumb">
            <span>Documentación</span>
            <span className="separator">/</span>
            <span>{documents.find(d => d.id === currentDoc)?.title}</span>
          </div>
        </div>

        <div className="content-body">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando documentación...</p>
            </div>
          ) : (
            <MarkdownViewer content={currentContent} />
          )}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DocumentationViewer;