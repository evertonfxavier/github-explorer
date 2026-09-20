import { FaHistory } from "@react-icons/all-files/fa/FaHistory";
import { FaTrash } from "@react-icons/all-files/fa/FaTrash";

type Props = {
  usernames: string[];
  onSelect: (username: string) => void;
  onClear: () => void;
};

export function RecentSearchesPanel({ usernames, onSelect, onClear }: Props) {
  const hasRecentSearches = usernames.length > 0;

  return (
    <section className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <FaHistory /> Buscas recentes:
        </span>
        {hasRecentSearches && (
          <button
            type="button"
            onClick={onClear}
            data-testid="clear-recent-searches"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            <FaTrash /> Limpar histórico
          </button>
        )}
      </div>
      {hasRecentSearches ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {usernames.map((username) => (
            <button
              key={username}
              type="button"
              onClick={() => onSelect(username)}
              data-testid="recent-search-item"
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
            >
              @{username}
            </button>
          ))}
        </div>
      ) : (
        <p
          data-testid="recent-searches-empty"
          className="mt-3 text-sm text-gray-400"
        >
          Sem buscas recentes por aqui.
        </p>
      )}
    </section>
  );
}
