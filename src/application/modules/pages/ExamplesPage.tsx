import React, { useEffect } from 'react';
import Icon from '../../components/header/icons';
import { useLayout } from '../../components/header/useLayout';

const ExamplesPage: React.FC = () => {
  const { setHeaderTitle, setHeaderSubtitle, setHeaderActions } = useLayout();

  useEffect(() => {
    setHeaderTitle('Ejemplos');
    setHeaderSubtitle('Casos de uso prácticos');

    setHeaderActions(
      <div className='flex items-center space-x-2'>
        <button className='px-3 py-1 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30 transition-all'>
          <Icon name='code' size='sm' className='mr-1' />
          Ver Código
        </button>
      </div>
    );

    return () => {
      setHeaderActions(undefined);
    };
  }, [setHeaderTitle, setHeaderSubtitle, setHeaderActions]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Ejemplos de Filter
          </h1>
          <p className='text-lg text-gray-600'>
            Explora casos de uso reales y ejemplos prácticos del componente
            Filter.
          </p>
        </div>

        <div className='space-y-8'>
          {/* Ejemplo Básico */}
          <div className='bg-white rounded-lg shadow-md p-8'>
            <div className='flex items-center mb-6'>
              <Icon name='code' size='lg' className='text-blue-600 mr-3' />
              <h2 className='text-2xl font-bold text-gray-900'>
                Ejemplo Básico
              </h2>
            </div>
            <p className='text-gray-600 mb-4'>
              Implementación básica del componente Filter con filtros de texto y
              selección.
            </p>
            <div className='bg-gray-50 p-4 rounded-md mb-4'>
              <code className='text-sm text-gray-800'>
                {`import { Filter } from '@andes-project/filter';

const filters = [
  { key: 'name', label: 'Nombre', type: 'text' },
  { key: 'category', label: 'Categoría', type: 'select', options: ['A', 'B', 'C'] }
];

<Filter data={data} filters={filters} onFilterChange={handleFilter} />`}
              </code>
            </div>
            <button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'>
              Ver Demo
            </button>
          </div>

          {/* Ejemplo Avanzado */}
          <div className='bg-white rounded-lg shadow-md p-8'>
            <div className='flex items-center mb-6'>
              <Icon name='filter' size='lg' className='text-green-600 mr-3' />
              <h2 className='text-2xl font-bold text-gray-900'>
                Ejemplo Avanzado
              </h2>
            </div>
            <p className='text-gray-600 mb-4'>
              Filtros avanzados con rangos de fechas, filtros numéricos y
              personalización completa.
            </p>
            <div className='bg-gray-50 p-4 rounded-md mb-4'>
              <code className='text-sm text-gray-800'>
                {`const advancedFilters = [
  { key: 'date', label: 'Fecha', type: 'date' },
  { key: 'price', label: 'Precio', type: 'number' },
  { key: 'status', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'] }
];

<Filter
  data={data}
  filters={advancedFilters}
  onFilterChange={handleFilter}
  className="custom-filter"
/>`}
              </code>
            </div>
            <button className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors'>
              Ver Demo
            </button>
          </div>

          {/* Ejemplo Personalizado */}
          <div className='bg-white rounded-lg shadow-md p-8'>
            <div className='flex items-center mb-6'>
              <Icon name='cog' size='lg' className='text-purple-600 mr-3' />
              <h2 className='text-2xl font-bold text-gray-900'>
                Ejemplo Personalizado
              </h2>
            </div>
            <p className='text-gray-600 mb-4'>
              Personalización completa con temas, estilos y comportamientos
              personalizados.
            </p>
            <div className='bg-gray-50 p-4 rounded-md mb-4'>
              <code className='text-sm text-gray-800'>
                {`// Filtros personalizados con validación
const customFilters = [
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    validator: (value) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)
  }
];

<Filter
  data={data}
  filters={customFilters}
  onFilterChange={handleFilter}
  theme="dark"
  showClearButton={true}
/>`}
              </code>
            </div>
            <button className='bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors'>
              Ver Demo
            </button>
          </div>
        </div>

        <div className='mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4 text-center'>
            ¿Quieres contribuir?
          </h2>
          <p className='text-gray-600 text-center mb-6'>
            Comparte tus ejemplos y casos de uso con la comunidad.
          </p>
          <div className='flex justify-center space-x-4'>
            <button className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'>
              <Icon name='github' size='sm' className='mr-2' />
              Enviar PR
            </button>
            <button className='border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors'>
              <Icon name='lightbulb' size='sm' className='mr-2' />
              Sugerir Ejemplo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplesPage;
