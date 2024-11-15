declare module "text-readability" {
  export function fleschReadingEase(text: string): number;
  export function daleChallReadabilityScore(text: string): number;
  export function textStandard(text: string, float_output?: boolean): string;
}
