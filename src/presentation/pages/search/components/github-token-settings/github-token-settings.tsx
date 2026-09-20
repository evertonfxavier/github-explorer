import { useState, type FormEvent } from "react";
import { FaKey } from "@react-icons/all-files/fa/FaKey";
import type { GithubToken } from "@/presentation/protocols";

type Props = {
  githubToken: GithubToken;
};

export function GithubTokenSettings({ githubToken }: Props) {
  const [open, setOpen] = useState(false);
  const [hasToken, setHasToken] = useState(() => Boolean(githubToken.load()));
  const [value, setValue] = useState("");

  function handleSave(event: FormEvent): void {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    githubToken.save(trimmed);
    setHasToken(true);
    setValue("");
    setOpen(false);
  }

  function handleClear(): void {
    githubToken.clear();
    setHasToken(false);
  }

  return (
    <section className="w-full max-w-2xl text-left text-sm text-gray-500">
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          data-testid="toggle-github-token"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <FaKey />
          {hasToken
            ? "Token do GitHub configurado"
            : "Limite de requisições baixo? Adicione um token do GitHub"}
        </button>
        {hasToken && (
          <button
            type="button"
            onClick={handleClear}
            data-testid="clear-github-token"
            className="text-xs text-gray-400 hover:text-red-500"
          >
            Remover
          </button>
        )}
      </div>

      {open && (
        <form
          onSubmit={handleSave}
          className="mt-3 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4"
        >
          <p className="text-xs text-gray-400">
            Gere um token em{" "}
            <a
              href="https://github.com/settings/tokens/new"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              github.com/settings/tokens/new
            </a>{" "}
            (sem nenhum escopo marcado). Ele fica salvo só no seu navegador.
          </p>
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="ghp_..."
            data-testid="github-token-input"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
          />
          <button
            type="submit"
            data-testid="save-github-token"
            className="self-start rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white"
          >
            Salvar
          </button>
        </form>
      )}
    </section>
  );
}
