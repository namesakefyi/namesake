import { useCallback, useEffect, useRef } from "react";

function useLatestRef(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

const PDFJS_CDN =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";
const WORKER_CDN =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
const MAX_SCALE = 1.5;

let pdfjsPromise = null;
function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import(/* @vite-ignore */ PDFJS_CDN).then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = WORKER_CDN;
      return lib;
    });
  }
  return pdfjsPromise;
}

export function PdfCanvas({
  pdfUrl,
  highlightedField,
  hoveredField,
  onFieldClick,
  fieldColors = {},
  selectedFields,
}) {
  const containerRef = useRef(null);
  const fieldMapRef = useRef(new Map());
  const activeHlsRef = useRef([]);
  const hoverHlRef = useRef(null);
  const passiveHlsRef = useRef([]);
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
    const scrollEl = container.parentElement; // .pdf-canvas-scroll
    container.innerHTML = "";
    fieldMapRef.current = new Map();
    passiveHlsRef.current = []; // DOM wiped — refs are stale
    activeHlsRef.current = [];
    hoverHlRef.current = null;

    let cancelled = false;

    async function render() {
      const pdfjsLib = await getPdfjs();
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      if (cancelled) return;

      // Scale pages to fit available width (container minus 2×16px padding)
      const availableWidth = (scrollEl.clientWidth || 600) - 32;
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
        await page.render({
          canvasContext: canvas.getContext("2d"),
          viewport: vp,
        }).promise;
        wrap.appendChild(canvas);
        container.appendChild(wrap);

        const anns = await page.getAnnotations();
        for (const ann of anns) {
          if (ann.subtype !== "Widget" || !ann.fieldName) continue;
          const [x1, y1, x2, y2] = vp.convertToViewportRectangle(ann.rect);
          const entry = {
            wrap,
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            w: Math.abs(x2 - x1),
            h: Math.abs(y2 - y1),
          };
          if (!fieldMapRef.current.has(ann.fieldName)) {
            fieldMapRef.current.set(ann.fieldName, []);
          }
          fieldMapRef.current.get(ann.fieldName).push(entry);

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
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedFields is a Set compared by reference; re-runs on every selection change
  useEffect(() => {
    for (const el of activeHlsRef.current) el.remove();
    activeHlsRef.current = [];

    const toHighlight =
      selectedFields?.size > 0
        ? selectedFields
        : highlightedField
          ? new Set([highlightedField])
          : null;
    if (!toHighlight) return;

    let scrollEl = null;
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
