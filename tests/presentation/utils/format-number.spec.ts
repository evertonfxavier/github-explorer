import { describe, expect, it } from 'vitest'
import { formatNumber } from '@/presentation/utils'

describe('formatNumber', () => {
  it('should not add separators to numbers below 1000', () => {
    expect(formatNumber(42)).toBe('42')
  })

  it('should add a thousands separator', () => {
    expect(formatNumber(1234)).toBe('1.234')
  })

  it('should add multiple thousands separators for larger numbers', () => {
    expect(formatNumber(1234567)).toBe('1.234.567')
  })

  it('should format zero as-is', () => {
    expect(formatNumber(0)).toBe('0')
  })
})
