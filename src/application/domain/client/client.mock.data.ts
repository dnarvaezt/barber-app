import type { Client } from './client.model'

// Función auxiliar para generar IDs únicos
const generateId = (index: number): string =>
  `cli_${String(index + 1).padStart(3, '0')}`

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

// Nombres realistas para clientes de barbería
const clientNames = [
  'Alejandro Morales',
  'Beatriz Silva',
  'Carlos Mendoza',
  'Diana Torres',
  'Eduardo Rojas',
  'Florencia Castro',
  'Gabriel Herrera',
  'Helena Vargas',
  'Ignacio Flores',
  'Julia Ortiz',
  'Kevin Jiménez',
  'Laura Ruiz',
  'Manuel Moreno',
  'Natalia Luna',
  'Oscar Vega',
  'Patricia Delgado',
  'Quentin Ríos',
  'Rosa Campos',
  'Sergio Guerrero',
  'Teresa Méndez',
  'Ulises Salazar',
  'Valeria Martínez',
  'Walter López',
  'Ximena Pérez',
  'Yamil González',
  'Zoe Ramírez',
  'Adrián Morales',
  'Brenda Silva',
  'Cristian Mendoza',
  'Daniela Torres',
  'Fernando Rojas',
  'Gabriela Castro',
  'Héctor Herrera',
  'Isabel Vargas',
  'Javier Flores',
  'Karina Ortiz',
  'Luis Jiménez',
  'María Ruiz',
  'Nicolás Moreno',
  'Olga Luna',
  'Pedro Vega',
  'Raquel Delgado',
  'Roberto Ríos',
  'Sofía Campos',
  'Tomás Guerrero',
  'Úrsula Méndez',
  'Víctor Salazar',
  'Wendy Martínez',
  'Xavier López',
  'Yanina Pérez',
  'Zacarías González',
  'Ana Ramírez',
  'Benjamín Morales',
  'Carmen Silva',
  'Diego Mendoza',
  'Elena Torres',
  'Felipe Rojas',
  'Gloria Castro',
  'Hugo Herrera',
  'Iris Vargas',
  'Joaquín Flores',
  'Karla Ortiz',
  'Leandro Jiménez',
  'Mónica Ruiz',
  'Néstor Moreno',
  'Ofelia Luna',
  'Pablo Vega',
  'Rocío Delgado',
  'Ricardo Ríos',
  'Silvia Campos',
  'Teodoro Guerrero',
  'Verónica Méndez',
  'Wilfredo Salazar',
  'Xochitl Martínez',
  'Yadira López',
  'Zenaida Pérez',
  'Adolfo González',
  'Berenice Ramírez',
  'Camilo Morales',
  'Débora Silva',
  'Emilio Mendoza',
  'Francisca Torres',
  'Gustavo Rojas',
  'Herminia Castro',
  'Imelda Herrera',
  'Jacqueline Vargas',
  'Kevin Flores',
  'Leticia Ortiz',
  'Marcelo Jiménez',
  'Nora Ruiz',
  'Octavio Moreno',
  'Pamela Luna',
  'René Vega',
  'Sonia Delgado',
  'Teodoro Ríos',
  'Úrsula Campos',
  'Valentín Guerrero',
  'Wanda Méndez',
  'Ximena Salazar',
  'Yolanda Martínez',
  'Zulema López',
  'Alicia Pérez',
  'Bernardo González',
  'Cecilia Ramírez',
  'Damián Morales',
  'Estela Silva',
  'Fabio Mendoza',
  'Graciela Torres',
  'Hernán Rojas',
  'Inés Castro',
  'Jorge Herrera',
  'Katherine Vargas',
  'Lorenzo Flores',
  'Martha Ortiz',
  'Nelson Jiménez',
  'Olga Ruiz',
  'Pascual Moreno',
  'Rita Luna',
  'Samuel Vega',
  'Tania Delgado',
  'Uriel Ríos',
  'Viviana Campos',
  'Wilmer Guerrero',
  'Xiomara Méndez',
  'Yamil Salazar',
  'Zuleika Martínez',
  'Adriano López',
  'Beatriz Pérez',
  'César González',
  'Dolores Ramírez',
  'Efraín Morales',
  'Fabiola Silva',
  'Gerardo Mendoza',
  'Hilda Torres',
  'Iván Rojas',
  'Josefina Castro',
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

export const clientMockData: Client[] = Array.from(
  { length: 120 },
  (_, index) => {
    const createdAt = generateRecentDate()
    const updatedAt = new Date(
      createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())
    )

    return {
      id: generateId(index),
      name: clientNames[index % clientNames.length],
      phoneNumber: generatePhoneNumber(),
      birthDate: generateRandomDate(),
      createdAt,
      updatedAt,
      createdBy: 'admin_001',
      updatedBy: 'admin_001',
    }
  }
)
