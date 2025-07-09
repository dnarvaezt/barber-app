import React from 'react'

const TailwindDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">
            Tailwind CSS Demo
          </h1>
          <p className="text-lg text-secondary-600">
            Configuración completa de Tailwind CSS en tu proyecto
          </p>
        </div>

        {/* Color Palette */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-lg font-semibold text-primary-600 mb-4">Primary Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded"></div>
                <span className="text-sm text-secondary-600">primary-500</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded"></div>
                <span className="text-sm text-secondary-600">primary-600</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-700 rounded"></div>
                <span className="text-sm text-secondary-600">primary-700</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-lg font-semibold text-secondary-600 mb-4">Secondary Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary-500 rounded"></div>
                <span className="text-sm text-secondary-600">secondary-500</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary-600 rounded"></div>
                <span className="text-sm text-secondary-600">secondary-600</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary-700 rounded"></div>
                <span className="text-sm text-secondary-600">secondary-700</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-lg font-semibold text-success-600 mb-4">Status Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success-500 rounded"></div>
                <span className="text-sm text-secondary-600">success-500</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-danger-500 rounded"></div>
                <span className="text-sm text-secondary-600">danger-500</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-warning-500 rounded"></div>
                <span className="text-sm text-secondary-600">warning-500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
          <h3 className="text-lg font-semibold text-secondary-800 mb-4">Botones con Tailwind</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 shadow-soft hover:shadow-medium">
              Primary
            </button>
            <button className="px-6 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors duration-200 shadow-soft hover:shadow-medium">
              Secondary
            </button>
            <button className="px-6 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors duration-200 shadow-soft hover:shadow-medium">
              Success
            </button>
            <button className="px-6 py-2 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors duration-200 shadow-soft hover:shadow-medium">
              Danger
            </button>
            <button className="px-6 py-2 bg-warning-500 text-white rounded-lg hover:bg-warning-600 transition-colors duration-200 shadow-soft hover:shadow-medium">
              Warning
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-soft p-6 border-l-4 border-primary-500">
            <h4 className="text-lg font-semibold text-primary-600 mb-2">Card con borde</h4>
            <p className="text-secondary-600">
              Esta tarjeta usa las clases de Tailwind para el diseño y las sombras personalizadas.
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary-500 to-info-500 rounded-lg shadow-medium p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Card con gradiente</h4>
            <p className="opacity-90">
              Tarjeta con gradiente usando los colores personalizados de Tailwind.
            </p>
          </div>
        </div>

        {/* Animations */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-secondary-800 mb-4">Animaciones</h3>
          <div className="flex items-center space-x-8">
            <div className="animate-spin-slow w-12 h-12 bg-primary-500 rounded-full"></div>
            <div className="animate-bounce-slow w-12 h-12 bg-success-500 rounded-full"></div>
            <div className="animate-pulse w-12 h-12 bg-warning-500 rounded-full"></div>
            <div className="animate-ping w-12 h-12 bg-danger-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindDemo;