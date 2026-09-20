import type { FieldValidation } from '@/validation/protocols'
import { RequiredFieldError } from '@/validation/errors'

export class RequiredFieldValidation implements FieldValidation {
  field: string

  constructor(field: string) {
    this.field = field
  }

  validate(fieldValue: string): Error | undefined {
    return fieldValue ? undefined : new RequiredFieldError()
  }
}
