import type {
  RoughAnnotationConfig,
  RoughAnnotationType,
} from "rough-notation/lib/model";

export const ANNOTATION_TYPES = [
  "highlight",
  "underline",
  "strike-through",
  "bracket",
  "circle",
  "box",
  "crossed-off",
] as const satisfies readonly RoughAnnotationType[];

export const annotationConfig: Record<
  RoughAnnotationType,
  Omit<RoughAnnotationConfig, "type">
> = {
  highlight: {
    multiline: true,
    iterations: 1,
    padding: 0,
  },
  underline: {
    multiline: true,
    iterations: 3,
    padding: 0,
  },
  box: {
    multiline: false,
    iterations: 3,
    padding: [0, 8, 0, 8],
  },
  bracket: {
    multiline: false,
    iterations: 1,
    padding: [0, 4, 0, 4],
    brackets: ["left", "right"],
  },
  circle: {
    multiline: false,
    iterations: 2,
    padding: [0, 16, 0, 16],
  },
  "strike-through": {
    multiline: true,
    iterations: 3,
    padding: 0,
  },
  "crossed-off": {
    multiline: false,
    iterations: 4,
    padding: 0,
  },
};
