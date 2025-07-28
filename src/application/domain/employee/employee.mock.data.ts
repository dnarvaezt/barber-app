import type { Employee } from './employee.model'

// Función auxiliar para generar IDs únicos
const generateId = (index: number): string =>
  `emp_${String(index + 1).padStart(3, '0')}`

// Función auxiliar para generar fechas aleatorias entre 1960 y 2000
const generateRandomDate = (): Date => {
  const start = new Date(1960, 0, 1)
  const end = new Date(2000, 11, 31)
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

// Función auxiliar para generar fechas de creación/actualización recientes
const generateRecentDate = (): Date => {
  const start = new Date(2023, 0, 1)
  const end = new Date()
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

// Función auxiliar para generar porcentajes realistas (entre 15% y 50%)
const generatePercentage = (): number => {
  return Math.floor(Math.random() * 36) + 15 // 15-50%
}

// Nombres realistas para empleados de barbería
const employeeNames = [
  'Carlos Mendoza',
  'Miguel Torres',
  'Alejandro Rojas',
  'Diego Silva',
  'Fernando Castro',
  'Roberto Morales',
  'Luis Herrera',
  'Jorge Vargas',
  'Ricardo Flores',
  'Manuel Ortiz',
  'Antonio Jiménez',
  'Francisco Ruiz',
  'Eduardo Moreno',
  'Gabriel Luna',
  'Héctor Vega',
  'Rafael Mendoza',
  'Alberto Cruz',
  'Mario Delgado',
  'Sergio Ríos',
  'Daniel Campos',
  'Andrés Guerrero',
  'Felipe Méndez',
  'Cristian Salazar',
  'José Martínez',
  'David López',
  'Juan Pérez',
  'Pedro González',
  'Marco Ramírez',
  'Arturo Morales',
  'Enrique Soto',
  'Raúl Castillo',
  'Oscar Herrera',
  'Adrián Mendoza',
  'Gerardo Torres',
  'Hugo Silva',
  'Iván Castro',
  'Nicolás Rojas',
  'Pablo Flores',
  'Rodrigo Ortiz',
  'Sebastián Jiménez',
  'Tomás Ruiz',
  'Víctor Moreno',
  'Walter Luna',
  'Xavier Vega',
  'Yamil Delgado',
  'Zacarías Ríos',
  'Adolfo Campos',
  'Benjamín Guerrero',
  'Camilo Méndez',
  'Damián Salazar',
  'Emilio Martínez',
  'Fabián López',
  'Gustavo Pérez',
  'Hernán González',
  'Ignacio Ramírez',
  'Joaquín Morales',
  'Kevin Soto',
  'Leandro Castillo',
  'Marcelo Herrera',
  'Néstor Mendoza',
  'Octavio Torres',
  'Patricio Silva',
  'Quentin Castro',
  'René Rojas',
  'Simón Flores',
  'Teodoro Ortiz',
  'Ulises Jiménez',
  'Valentín Ruiz',
  'Wilfredo Moreno',
  'Ximena Luna',
  'Yolanda Vega',
  'Zulema Delgado',
  'Ana Ríos',
  'Beatriz Campos',
  'Carmen Guerrero',
  'Diana Méndez',
  'Elena Salazar',
  'Florencia Martínez',
  'Gabriela López',
  'Helena Pérez',
  'Isabel González',
  'Julia Ramírez',
  'Karina Morales',
  'Laura Soto',
  'María Castillo',
  'Natalia Herrera',
  'Olga Mendoza',
  'Patricia Torres',
  'Rosa Silva',
  'Sofía Castro',
  'Teresa Rojas',
  'Úrsula Flores',
  'Valeria Ortiz',
  'Wendy Jiménez',
  'Xiomara Ruiz',
  'Yanina Moreno',
  'Zoe Luna',
  'Adriana Vega',
  'Brenda Delgado',
  'Cecilia Ríos',
  'Dolores Campos',
  'Estela Guerrero',
  'Fabiola Méndez',
  'Gloria Salazar',
  'Hilda Martínez',
  'Iris López',
  'Jacqueline Pérez',
  'Karla González',
  'Leticia Ramírez',
  'Mónica Morales',
  'Nora Soto',
  'Ofelia Castillo',
  'Pamela Herrera',
  'Rocío Mendoza',
  'Silvia Torres',
  'Tania Silva',
  'Verónica Castro',
  'Wanda Rojas',
  'Xochitl Flores',
  'Yadira Ortiz',
  'Zenaida Jiménez',
  'Alicia Ruiz',
  'Berenice Moreno',
  'Claudia Luna',
  'Débora Vega',
  'Elsa Delgado',
  'Francisca Ríos',
  'Graciela Campos',
  'Herminia Guerrero',
  'Imelda Méndez',
]

// Números de teléfono colombianos con formato +57
const generatePhoneNumber = (): string => {
  const prefixes = [
    '300',
    '301',
    '302',
    '303',
    '304',
    '305',
    '310',
    '311',
    '312',
    '313',
    '314',
    '315',
    '316',
    '317',
    '318',
    '319',
    '320',
    '321',
    '322',
    '323',
    '324',
    '325',
    '350',
    '351',
    '352',
    '353',
    '354',
    '355',
    '356',
    '357',
    '358',
    '359',
  ]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const number = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, '0')
  return `+57${prefix}${number}`
}

export const employeeMockData: Employee[] = Array.from(
  { length: 120 },
  (_, index) => {
    const createdAt = generateRecentDate()
    const updatedAt = new Date(
      createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())
    )

    return {
      id: generateId(index),
      name: employeeNames[index % employeeNames.length],
      phoneNumber: generatePhoneNumber(),
      birthDate: generateRandomDate(),
      createdAt,
      updatedAt,
      createdBy: 'admin_001',
      updatedBy: 'admin_001',
      percentage: generatePercentage(),
    }
  }
)
