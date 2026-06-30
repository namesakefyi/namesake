export interface PageExclusion {
  /** 1-based page number to exclude from text comparison */
  page: number;
  reason: string;
}

export interface MonitorConfig {
  excludePages?: PageExclusion[];
}

/**
 * Per-PDF monitoring overrides. Keys are PDF ids (matching the directory name
 * under web/src/content/pdfs, e.g. "background-check-authorization-of-release").
 *
 * Add an entry here when the upstream PDF contains pages that deliberately
 * differ from the local copy — translated pages, signature instructions,
 * cover sheets, etc. Always include a reason so future maintainers understand
 * why the exclusion exists.
 */
export const monitorConfig: Record<string, MonitorConfig> = {
  "background-check-authorization-of-release": {
    excludePages: [
      {
        page: 2,
        reason:
          "Spanish translation of English content; local copy retains English only.",
      },
    ],
  },
};
