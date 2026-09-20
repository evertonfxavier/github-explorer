import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import type { FieldValidation } from '@/validation/protocols'
import type { Validation } from '@/presentation/protocols'

export const makeSearchValidation = (): Validation => {
  const validations: FieldValidation[] = [new RequiredFieldValidation('username')]
  return new ValidationComposite(validations)
}
