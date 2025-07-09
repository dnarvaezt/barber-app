import React from 'react'

const SimpleDemo: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          🎉 Tailwind CSS está funcionando!
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Tu proyecto está configurado correctamente con Tailwind CSS v4
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Colores</h3>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded"></div>
              <div className="w-8 h-8 bg-green-500 rounded"></div>
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
              <div className="w-8 h-8 bg-yellow-500 rounded"></div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Responsive</h3>
            <p className="text-sm">
              Este grid se adapta automáticamente en móviles
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Animaciones</h3>
            <div className="animate-bounce w-8 h-8 bg-white rounded-full mx-auto"></div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn btn--primary">
            Botón Primary
          </button>
          <button className="btn btn--success">
            Botón Success
          </button>
          <button className="btn btn--danger">
            Botón Danger
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleDemo;