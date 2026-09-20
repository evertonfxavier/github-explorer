import { Spinner } from "@heroui/react";

export function Loading() {
  return (
    <div
      data-testid="loading-wrap"
      className="flex h-full min-h-[60vh] items-center justify-center py-10"
    >
      <Spinner size="lg" />
    </div>
  );
}
