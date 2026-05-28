import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Fragment, useEffect, useRef, useState } from "react";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

type Rect = { x: number; y: number; w: number; h: number };

interface PageData {
  pageNum: number;
  page: pdfjsLib.PDFPageProxy;
  vp: pdfjsLib.PageViewport;
  fields: Map<string, Rect[]>;
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

function PdfPage({
  page,
  vp,
}: {
  page: pdfjsLib.PDFPageProxy;
  vp: pdfjsLib.PageViewport;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const task = page.render({ canvasContext: ctx, viewport: vp });
    return () => {
      task.cancel();
    };
  }, [page, vp]);

  return <canvas ref={canvasRef} width={vp.width} height={vp.height} />;
}

export function PdfCanvas({
  pdfUrl,
  highlightedField,
  hoveredField,
  onFieldClick,
  fieldColors = {},
  selectedFields,
}: PdfCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const onFieldClickRef = useLatestRef(onFieldClick);

  useEffect(() => {
    setPages([]);
    if (!pdfUrl) return;
    const url = pdfUrl;
    let cancelled = false;

    async function load() {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;
      const pdf = await pdfjsLib.getDocument(url).promise;
      if (cancelled) return;

      const availableWidth = scrollEl.clientWidth - 32;
      const firstPage = await pdf.getPage(1);
      const naturalVp = firstPage.getViewport({ scale: 1 });
      const scale = Math.min(MAX_SCALE, availableWidth / naturalVp.width);

      const result: PageData[] = [];
      for (let p = 1; p <= pdf.numPages; p++) {
        if (cancelled) break;
        const page = await pdf.getPage(p);
        const vp = page.getViewport({ scale });
        const fields = new Map<string, Rect[]>();
        for (const ann of await page.getAnnotations()) {
          if (ann.subtype !== "Widget" || !ann.fieldName) continue;
          const [x1, y1, x2, y2] = vp.convertToViewportRectangle(ann.rect);
          const rect: Rect = {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            w: Math.abs(x2 - x1),
            h: Math.abs(y2 - y1),
          };
          if (!fields.has(ann.fieldName)) fields.set(ann.fieldName, []);
          fields.get(ann.fieldName)?.push(rect);
        }
        result.push({ pageNum: p, page, vp, fields });
      }

      if (!cancelled) setPages(result);
    }

    load().catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pages re-triggers after PDF renders so data-scroll-target is in the DOM
  useEffect(() => {
    if (!highlightedField || !scrollRef.current) return;
    const target = scrollRef.current.querySelector<HTMLElement>(
      "[data-scroll-target]",
    );
    if (!target) return;
    const scrollEl = scrollRef.current;
    requestAnimationFrame(() => {
      const { top: st, height: sh } = scrollEl.getBoundingClientRect();
      const { top: tt, height: th } = target.getBoundingClientRect();
      scrollEl.scrollTo({
        top: Math.max(0, scrollEl.scrollTop + (tt - st) - sh / 2 + th / 2),
        behavior: "smooth",
      });
    });
  }, [highlightedField, pages]);

  const toHighlight =
    selectedFields && selectedFields.size > 0
      ? selectedFields
      : highlightedField
        ? new Set([highlightedField])
        : new Set<string>();

  return (
    <div ref={scrollRef} className="pdf-canvas-scroll">
      <div className="pdf-canvas-container">
        {pages.map(({ pageNum, page, vp, fields }) => (
          <div
            key={pageNum}
            className="page-wrap"
            style={{ width: vp.width, height: vp.height }}
          >
            <PdfPage page={page} vp={vp} />
            {[...fields.entries()].flatMap(([name, rects]) =>
              rects.map((rect) => {
                const style = {
                  left: rect.x,
                  top: rect.y,
                  width: rect.w,
                  height: rect.h,
                };
                const isActive = toHighlight.has(name);
                const color = fieldColors[name];
                const key = `${name}-${rect.x}-${rect.y}`;
                return (
                  <Fragment key={key}>
                    {color && !isActive && (
                      <div
                        className="field-passive-highlight"
                        style={{ ...style, background: color }}
                      />
                    )}
                    {hoveredField === name && (
                      <div className="field-hover-highlight" style={style} />
                    )}
                    {isActive && (
                      <div
                        className="field-highlight"
                        style={style}
                        data-scroll-target={
                          name === highlightedField ? "" : undefined
                        }
                      />
                    )}
                    <button
                      type="button"
                      className="field-click-zone"
                      style={style}
                      onClick={() => onFieldClickRef.current(name)}
                    />
                  </Fragment>
                );
              }),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
