interface EntityWithNameAndPhone {
  name: string
  phoneNumber: string
  birthDate: Date
}

export class EntityFilterService {
  static filterEntities<T extends EntityWithNameAndPhone>(
    entities: T[],
    searchTerm: string,
    birthMonthFilter: number | ''
  ): T[] {
    let filtered = entities

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        entity =>
          entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entity.phoneNumber.includes(searchTerm)
      )
    }

    // Filtro por mes de cumpleaños
    if (birthMonthFilter !== '') {
      filtered = filtered.filter(entity => {
        const birthMonth = entity.birthDate.getMonth() + 1 // getMonth() retorna 0-11
        return birthMonth === birthMonthFilter
      })
    }

    return filtered
  }
}
