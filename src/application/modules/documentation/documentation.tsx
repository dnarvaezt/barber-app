import './documentation.scss'
import React from 'react'
import DocumentationViewer from './components/DocumentationViewer'

const Documentation: React.FC = () => {
  return (
    <div className="documentation">
      <DocumentationViewer />
    </div>
  );
};

export default Documentation;
