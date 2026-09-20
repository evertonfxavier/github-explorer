import type { Validation } from '@/presentation/protocols'

export class ValidationSpy implements Validation {
  errorMessage = ''
  fieldName?: string
  fieldValue?: string

  validate(fieldName: string, fieldValue: string): string {
    this.fieldName = fieldName
    this.fieldValue = fieldValue
    return this.errorMessage
  }
}
