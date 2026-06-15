import type { Diff } from "../types";

interface DiffBannerProps {
  diff: Diff;
  onDismiss: () => void;
}

export function DiffBanner({ diff, onDismiss }: DiffBannerProps) {
  const { added = [], removed = [] } = diff;
  if (added.length === 0 && removed.length === 0) return null;

  return (
    <div className="diff-banner" role="status">
      <div className="diff-banner-content">
        {added.length > 0 && (
          <ins className="diff-added">
            +{added.length} new field{added.length !== 1 ? "s" : ""}:{" "}
            {added.join(", ")}
          </ins>
        )}
        {removed.length > 0 && (
          <del className="diff-removed">
            -{removed.length} removed: {removed.join(", ")}
          </del>
        )}
        {added.length > 0 && (
          <span className="diff-hint">Wire new fields in index.ts</span>
        )}
      </div>
      <button
        type="button"
        className="diff-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
