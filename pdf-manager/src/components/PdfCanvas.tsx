import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useCallback, useEffect, useRef } from "react";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

interface FieldEntry {
  wrap: HTMLDivElement;
  x: number;
  y: number;
  w: number;
  h: number;
}

function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

const MAX_SCALE = 1.5;

interface PdfCanvasProps {
  pdfUrl: string | null;
  highlightedField: string | null;
  hoveredField: string | null;
  onFieldClick: (name: string) => void;
  fieldColors?: Record<string, string>;
  selectedFields?: Set<string>;
}

export function PdfCanvas({
  pdfUrl,
  highlightedField,
  hoveredField,
  onFieldClick,
  fieldColors = {},
  selectedFields,
}: PdfCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldMapRef = useRef(new Map<string, FieldEntry[]>());
  const activeHlsRef = useRef<HTMLDivElement[]>([]);
  const hoverHlRef = useRef<HTMLDivElement | null>(null);
  const passiveHlsRef = useRef<HTMLDivElement[]>([]);
  const onFieldClickRef = useLatestRef(onFieldClick);
  const fieldColorsRef = useLatestRef(fieldColors);

  // Stable: reads only through refs so it never needs to be recreated.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reads through stable refs intentionally
  const applyPassiveHighlights = useCallback(() => {
    for (const el of passiveHlsRef.current) el.remove();
    passiveHlsRef.current = [];
    for (const [name, color] of Object.entries(fieldColorsRef.current)) {
      const entries = fieldMapRef.current.get(name);
      if (!entries?.length) continue;
      for (const { wrap, x, y, w, h } of entries) {
        const el = document.createElement("div");
        el.className = "field-passive-highlight";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.background = color;
        wrap.appendChild(el);
        passiveHlsRef.current.push(el);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-apply passive highlights whenever fieldColors changes (e.g. user assigns a mapping).
  // No-op until PDF has rendered and fieldMapRef is populated.
  // biome-ignore lint/correctness/useExhaustiveDependencies: fieldColors triggers re-run; applyPassiveHighlights reads it through a ref
  useEffect(() => {
    applyPassiveHighlights();
  }, [fieldColors, applyPassiveHighlights]);

  // Render PDF pages on mount / URL change
  // biome-ignore lint/correctness/useExhaustiveDependencies: onFieldClickRef is a stable ref; reads through it intentionally
  useEffect(() => {
    if (!pdfUrl) return;
    const container = containerRef.current;
    if (!container) return;
    const scrollEl = container.parentElement;
    if (!scrollEl) return;
    container.innerHTML = "";
    fieldMapRef.current = new Map();
    passiveHlsRef.current = []; // DOM wiped — refs are stale
    activeHlsRef.current = [];
    hoverHlRef.current = null;

    let cancelled = false;

    const resolvedUrl = pdfUrl;
    async function render() {
      const pdf = await pdfjsLib.getDocument(resolvedUrl).promise;
      if (cancelled) return;

      // Scale pages to fit available width (container minus 2×16px padding)
      const availableWidth = (scrollEl?.clientWidth || 600) - 32;
      const firstPage = await pdf.getPage(1);
      const naturalVp = firstPage.getViewport({ scale: 1 });
      const scale = Math.min(MAX_SCALE, availableWidth / naturalVp.width);

      for (let p = 1; p <= pdf.numPages; p++) {
        if (cancelled) break;
        const page = await pdf.getPage(p);
        const vp = page.getViewport({ scale });

        const wrap = document.createElement("div");
        wrap.className = "page-wrap";
        wrap.style.width = `${vp.width}px`;
        wrap.style.height = `${vp.height}px`;

        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        wrap.appendChild(canvas);
        container?.appendChild(wrap);

        const anns = await page.getAnnotations();
        for (const ann of anns) {
          if (ann.subtype !== "Widget" || !ann.fieldName) continue;
          const [x1, y1, x2, y2] = vp.convertToViewportRectangle(ann.rect);
          const entry: FieldEntry = {
            wrap,
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            w: Math.abs(x2 - x1),
            h: Math.abs(y2 - y1),
          };
          if (!fieldMapRef.current.has(ann.fieldName)) {
            fieldMapRef.current.set(ann.fieldName, []);
          }
          fieldMapRef.current.get(ann.fieldName)?.push(entry);

          const clickZone = document.createElement("div");
          clickZone.className = "field-click-zone";
          clickZone.style.left = `${entry.x}px`;
          clickZone.style.top = `${entry.y}px`;
          clickZone.style.width = `${entry.w}px`;
          clickZone.style.height = `${entry.h}px`;
          clickZone.addEventListener("click", () =>
            onFieldClickRef.current?.(ann.fieldName),
          );
          wrap.appendChild(clickZone);
        }
      }

      // Apply any already-known passive highlights now that positions are populated
      if (!cancelled) applyPassiveHighlights();
    }

    render().catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [pdfUrl, applyPassiveHighlights]);

  // Hover highlight — thin outline, no scroll
  useEffect(() => {
    if (hoverHlRef.current) {
      hoverHlRef.current.remove();
      hoverHlRef.current = null;
    }
    if (!hoveredField) return;
    const entries = fieldMapRef.current.get(hoveredField);
    if (!entries?.length) return;
    const { wrap, x, y, w, h } = entries[0];
    const el = document.createElement("div");
    el.className = "field-hover-highlight";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    wrap.appendChild(el);
    hoverHlRef.current = el;
  }, [hoveredField]);

  // Highlight selected fields — draw outline for each; scroll to highlightedField
  useEffect(() => {
    for (const el of activeHlsRef.current) el.remove();
    activeHlsRef.current = [];

    const toHighlight =
      selectedFields && selectedFields.size > 0
        ? selectedFields
        : highlightedField
          ? new Set([highlightedField])
          : null;
    if (!toHighlight) return;

    let scrollEl: HTMLDivElement | null = null;
    for (const name of toHighlight) {
      const entries = fieldMapRef.current.get(name);
      if (!entries?.length) continue;
      for (const { wrap, x, y, w, h } of entries) {
        const el = document.createElement("div");
        el.className = "field-highlight";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        wrap.appendChild(el);
        activeHlsRef.current.push(el);
        if (name === highlightedField && !scrollEl) scrollEl = el;
      }
    }

    if (scrollEl) {
      const scrollContainer = containerRef.current?.parentElement;
      if (scrollContainer) {
        const capturedEl = scrollEl;
        requestAnimationFrame(() => {
          const scrollRect = scrollContainer.getBoundingClientRect();
          const elRect = capturedEl.getBoundingClientRect();
          const target =
            scrollContainer.scrollTop +
            (elRect.top - scrollRect.top) -
            scrollRect.height / 2 +
            elRect.height / 2;
          scrollContainer.scrollTo({
            top: Math.max(0, target),
            behavior: "smooth",
          });
        });
      }
    }
  }, [highlightedField, selectedFields]);

  return (
    <div className="pdf-canvas-scroll">
      <div ref={containerRef} className="pdf-canvas-container" />
    </div>
  );
}
