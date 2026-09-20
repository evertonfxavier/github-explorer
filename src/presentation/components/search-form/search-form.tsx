import { useState } from "react";
import type { FormEvent } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import { FaArrowRight } from "@react-icons/all-files/fa/FaArrowRight";
import type { Validation } from "@/presentation/protocols";

type Props = {
  validation: Validation;
  onSearch: (username: string) => void;
};

export function SearchForm({ validation, onSearch }: Props) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  function handleChange(value: string): void {
    setUsername(value);
    if (error) setError(validation.validate("username", value));
  }

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();

    const validationError = validation.validate("username", username);
    setError(validationError);
    if (validationError) return;

    onSearch(username);
  }

  return (
    <Form onSubmit={handleSubmit} className="w-full">
      <TextField
        isInvalid={!!error}
        name="username"
        value={username}
        onChange={handleChange}
        className="w-full"
      >
        <Label className="sr-only">Usuário do GitHub</Label>
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pr-1.5 pl-5 shadow-sm">
          <FaSearch className="shrink-0 text-gray-400" />
          <Input
            data-testid="username-input"
            placeholder="Digite o usuário do GitHub"
            className="flex-1 border-none bg-transparent px-2 py-2 text-left text-sm outline-none"
          />
          <Button
            type="submit"
            variant="primary"
            className="flex shrink-0 items-center gap-2 rounded-full px-5"
          >
            Buscar <FaArrowRight />
          </Button>
        </div>
        {error && (
          <FieldError data-testid="username-error" className="mt-2 block">
            {error}
          </FieldError>
        )}
      </TextField>
    </Form>
  );
}
