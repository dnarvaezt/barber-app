// ============================================================================
// TRACK ACTIVITY UTILS TESTS - Pruebas TDD para utilidades
// ============================================================================

import {
  formatActivityDate,
  formatActivityTime,
  getActivityStateColor,
  getActivityStateIcon,
} from '../../infrastructure'

// ============================================================================
// FORMAT ACTIVITY TIME TESTS
// ============================================================================

describe('formatActivityTime', () => {
  it('should format seconds correctly', () => {
    expect(formatActivityTime(30)).toBe('00:30')
    expect(formatActivityTime(65)).toBe('01:05')
    expect(formatActivityTime(125)).toBe('02:05')
  })

  it('should handle zero seconds', () => {
    expect(formatActivityTime(0)).toBe('00:00')
  })

  it('should handle large numbers', () => {
    expect(formatActivityTime(3661)).toBe('61:01') // 1 hour 1 minute 1 second
  })

  it('should handle decimal seconds (truncates)', () => {
    expect(formatActivityTime(30.7)).toBe('00:30')
    expect(formatActivityTime(65.9)).toBe('01:05')
  })

  it('should handle negative numbers', () => {
    expect(formatActivityTime(-30)).toBe('00:30') // Math.abs behavior
  })
})

// ============================================================================
// FORMAT ACTIVITY DATE TESTS
// ============================================================================

describe('formatActivityDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15T10:30:45')
    const formatted = formatActivityDate(date)

    // El formato exacto depende del locale, pero debería contener la hora
    expect(formatted).toMatch(/\d{1,2}:\d{2}:\d{2}/)
  })

  it('should return N/A for null date', () => {
    expect(formatActivityDate(null)).toBe('N/A')
  })

  it('should return N/A for undefined date', () => {
    expect(formatActivityDate(undefined as any)).toBe('N/A')
  })

  it('should handle different date formats', () => {
    const date1 = new Date('2024-01-15T10:30:45')
    const date2 = new Date('2024-12-31T23:59:59')

    const formatted1 = formatActivityDate(date1)
    const formatted2 = formatActivityDate(date2)

    expect(formatted1).toMatch(/\d{1,2}:\d{2}:\d{2}/)
    expect(formatted2).toMatch(/\d{1,2}:\d{2}:\d{2}/)
  })
})

// ============================================================================
// GET ACTIVITY STATE COLOR TESTS
// ============================================================================

describe('getActivityStateColor', () => {
  it('should return correct color for active state', () => {
    expect(getActivityStateColor('active')).toBe('#10b981')
  })

  it('should return correct color for suspended state', () => {
    expect(getActivityStateColor('suspended')).toBe('#f59e0b')
  })

  it('should return correct color for finished state', () => {
    expect(getActivityStateColor('finished')).toBe('#ef4444')
  })

  it('should return default color for unknown state', () => {
    expect(getActivityStateColor('unknown')).toBe('#6b7280')
  })

  it('should return default color for empty string', () => {
    expect(getActivityStateColor('')).toBe('#6b7280')
  })

  it('should be case insensitive', () => {
    expect(getActivityStateColor('ACTIVE')).toBe('#10b981')
    expect(getActivityStateColor('Active')).toBe('#10b981')
  })

  it('should handle null and undefined', () => {
    expect(getActivityStateColor(null as any)).toBe('#6b7280')
    expect(getActivityStateColor(undefined as any)).toBe('#6b7280')
  })
})

// ============================================================================
// GET ACTIVITY STATE ICON TESTS
// ============================================================================

describe('getActivityStateIcon', () => {
  it('should return correct icon for active state', () => {
    expect(getActivityStateIcon('active')).toBe('🟢')
  })

  it('should return correct icon for suspended state', () => {
    expect(getActivityStateIcon('suspended')).toBe('⏸️')
  })

  it('should return correct icon for finished state', () => {
    expect(getActivityStateIcon('finished')).toBe('🔴')
  })

  it('should return default icon for unknown state', () => {
    expect(getActivityStateIcon('unknown')).toBe('⚪')
  })

  it('should return default icon for empty string', () => {
    expect(getActivityStateIcon('')).toBe('⚪')
  })

  it('should be case insensitive', () => {
    expect(getActivityStateIcon('ACTIVE')).toBe('🟢')
    expect(getActivityStateIcon('Active')).toBe('🟢')
  })

  it('should handle null and undefined', () => {
    expect(getActivityStateIcon(null as any)).toBe('⚪')
    expect(getActivityStateIcon(undefined as any)).toBe('⚪')
  })
})

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Utils Integration', () => {
  it('should work together for a complete activity record', () => {
    const activeTime = 125 // 2 minutes 5 seconds
    const date = new Date('2024-01-15T10:30:45')
    const state = 'active'

    const formattedTime = formatActivityTime(activeTime)
    const formattedDate = formatActivityDate(date)
    const stateColor = getActivityStateColor(state)
    const stateIcon = getActivityStateIcon(state)

    expect(formattedTime).toBe('02:05')
    expect(formattedDate).toMatch(/\d{1,2}:\d{2}:\d{2}/)
    expect(stateColor).toBe('#10b981')
    expect(stateIcon).toBe('🟢')
  })

  it('should handle edge cases consistently', () => {
    // Zero values
    expect(formatActivityTime(0)).toBe('00:00')
    expect(formatActivityDate(null)).toBe('N/A')
    expect(getActivityStateColor('')).toBe('#6b7280')
    expect(getActivityStateIcon('')).toBe('⚪')

    // Large values
    expect(formatActivityTime(999999)).toBe('16666:39')
    expect(formatActivityTime(3600)).toBe('60:00') // 1 hour
  })

  it('should maintain consistency across different states', () => {
    const states = ['active', 'suspended', 'finished', 'unknown']

    states.forEach(state => {
      const color = getActivityStateColor(state)
      const icon = getActivityStateIcon(state)

      expect(color).toBeDefined()
      expect(icon).toBeDefined()
      expect(typeof color).toBe('string')
      expect(typeof icon).toBe('string')
    })
  })
})

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

describe('Utils Performance', () => {
  it('should handle large numbers efficiently', () => {
    const startTime = performance.now()

    for (let i = 0; i < 1000; i++) {
      formatActivityTime(i)
      formatActivityDate(new Date())
      getActivityStateColor('active')
      getActivityStateIcon('active')
    }

    const endTime = performance.now()
    const duration = endTime - startTime

    // Debería completarse en menos de 100ms
    expect(duration).toBeLessThan(100)
  })

  it('should handle edge cases without errors', () => {
    const edgeCases = [
      null,
      undefined,
      '',
      '   ',
      'ACTIVE',
      'Active',
      'aCtIvE',
      0,
      -1,
      999999,
      new Date('invalid'),
    ]

    edgeCases.forEach(edgeCase => {
      expect(() => {
        formatActivityTime(edgeCase as any)
        formatActivityDate(edgeCase as any)
        getActivityStateColor(edgeCase as any)
        getActivityStateIcon(edgeCase as any)
      }).not.toThrow()
    })
  })
})

// ============================================================================
// VALIDATION TESTS
// ============================================================================

describe('Utils Validation', () => {
  it('should validate time formatting edge cases', () => {
    // Casos extremos de tiempo
    expect(formatActivityTime(Number.MAX_SAFE_INTEGER)).toBeDefined()
    expect(formatActivityTime(Number.MIN_SAFE_INTEGER)).toBeDefined()
    expect(formatActivityTime(NaN)).toBe('00:00')
    expect(formatActivityTime(Infinity)).toBe('00:00')
    expect(formatActivityTime(-Infinity)).toBe('00:00')
  })

  it('should validate date formatting edge cases', () => {
    // Casos extremos de fecha
    expect(formatActivityDate(new Date(0))).toBeDefined() // Unix epoch
    expect(formatActivityDate(new Date('1970-01-01'))).toBeDefined()
    expect(formatActivityDate(new Date('9999-12-31'))).toBeDefined()
    expect(formatActivityDate(new Date('invalid'))).toBeDefined()
  })

  it('should validate state color/icon edge cases', () => {
    // Casos extremos de estado
    const edgeStates = [
      '',
      '   ',
      'ACTIVE',
      'active',
      'Active',
      'aCtIvE',
      'ACTIVE_STATE',
      'active_state',
      'ACTIVE_STATE_EXTRA',
      'a',
      'ab',
      'abc',
      'abcd',
      'abcde',
      'abcdef',
      'abcdefg',
      'abcdefgh',
      'abcdefghi',
      'abcdefghij',
      'abcdefghijk',
      'abcdefghijkl',
      'abcdefghijklm',
      'abcdefghijklmn',
      'abcdefghijklmno',
      'abcdefghijklmnop',
      'abcdefghijklmnopq',
      'abcdefghijklmnopqr',
      'abcdefghijklmnopqrs',
      'abcdefghijklmnopqrst',
      'abcdefghijklmnopqrstu',
      'abcdefghijklmnopqrstuv',
      'abcdefghijklmnopqrstuvw',
      'abcdefghijklmnopqrstuvwx',
      'abcdefghijklmnopqrstuvwxy',
      'abcdefghijklmnopqrstuvwxyz',
    ]

    edgeStates.forEach(state => {
      expect(getActivityStateColor(state)).toBeDefined()
      expect(getActivityStateIcon(state)).toBeDefined()
    })
  })
})
