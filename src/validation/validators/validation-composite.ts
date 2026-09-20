import type { Validation } from '@/presentation/protocols'
import type { FieldValidation } from '@/validation/protocols'

export class ValidationComposite implements Validation {
  private readonly validators: FieldValidation[]

  constructor(validators: FieldValidation[]) {
    this.validators = validators
  }

  validate(fieldName: string, fieldValue: string): string {
    const fieldValidators = this.validators.filter(validator => validator.field === fieldName)

    for (const validator of fieldValidators) {
      const error = validator.validate(fieldValue)
      if (error) return error.message
    }

    return ''
  }
}
