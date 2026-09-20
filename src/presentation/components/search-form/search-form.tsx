import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import type { Validation } from '@/presentation/protocols'

type Props = {
  validation: Validation
  onSearch: (username: string) => void
}

export function SearchForm({ validation, onSearch }: Props) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  function handleChange(value: string): void {
    setUsername(value)
    if (error) setError(validation.validate('username', value))
  }

  function handleSubmit(event: FormEvent): void {
    event.preventDefault()

    const validationError = validation.validate('username', username)
    setError(validationError)
    if (validationError) return

    onSearch(username)
  }

  return (
    <Form onSubmit={handleSubmit} className="w-full max-w-md">
      <TextField isInvalid={!!error} name="username" value={username} onChange={handleChange} className="w-full">
        <Label className="sr-only">Usuário do GitHub</Label>
        <div className="flex gap-2">
          <Input
            data-testid="username-input"
            placeholder="Digite um usuário do GitHub"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" variant="primary">
            Buscar
          </Button>
        </div>
        {error && <FieldError data-testid="username-error">{error}</FieldError>}
      </TextField>
    </Form>
  )
}
