import type { RefObject } from "react";
import { useEffect, useLayoutEffect, useState } from "react";

export function useFieldRowRect(
  fieldName: string,
  listRef: RefObject<HTMLElement | null>,
): DOMRect | null {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const inner = Array.from(
      listRef.current?.querySelectorAll("[data-field-id]") ?? [],
    ).find((el) => (el as HTMLElement).dataset.fieldId === fieldName);
    const li = inner?.closest("[role='option']");
    if (li) setRect(li.getBoundingClientRect());
  }, [fieldName, listRef]);

  return rect;
}

export function useScrollSelectedIntoView(
  highlightedField: string | null,
  listRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!highlightedField || !listRef.current) return;
    const item = listRef.current.querySelector('[aria-selected="true"]');
    if (!item) return;
    const { top: lt, bottom: lb } = listRef.current.getBoundingClientRect();
    const { top: it, bottom: ib } = item.getBoundingClientRect();
    if (it < lt || ib > lb) item.scrollIntoView({ block: "nearest" });
  }, [highlightedField, listRef]);
}
