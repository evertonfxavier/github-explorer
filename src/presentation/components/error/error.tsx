import { Button } from '@heroui/react'

type Props = {
  error: string
  reload: () => void
}

export function ErrorMessage({ error, reload }: Props) {
  return (
    <div data-testid="error-wrap" className="flex flex-col items-center gap-3 py-10 text-center">
      <span data-testid="error-message" className="text-sm text-red-600">
        {error}
      </span>
      <Button onPress={reload} variant="secondary">
        Tentar novamente
      </Button>
    </div>
  )
}
