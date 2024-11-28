import { Badge } from "@/components/common";
import { Frown, Meh, Smile } from "lucide-react";
import rs from "text-readability";

/**
 * A badge that displays a grade-level readability score of a given text.
 */
export interface ReadingScoreProps {
  /**
   * The text to calculate the readability score for.
   */
  text: string;
  /**
   * The minimum length of the text to calculate the score.
   * @default 280
   */
  minLength?: number;
}

export const ReadingScore = ({ text, minLength = 280 }: ReadingScoreProps) => {
  if (!text || text.length < minLength) return null;

  const score = rs.daleChallReadabilityScore(text);

  if (!score) return null;

  const variant = score >= 8 ? "danger" : score >= 6 ? "warning" : "success";
  const icon = score >= 8 ? Frown : score >= 6 ? Meh : Smile;

  const readingLevel = (score: number) => {
    if (score >= 9) return "College";
    if (score >= 8) return "11th–12th grade";
    if (score >= 7) return "9th–10th grade";
    if (score >= 6) return "7th–8th grade";
    if (score >= 5) return "5th–6th grade";
    if (score > 0) return "4th grade or lower";
    return "Unknown";
  };

  return (
    <Badge icon={icon} variant={variant}>
      <span>
        <span>{readingLevel(score)} </span>
        <span className="opacity-60">reading level</span>
      </span>
    </Badge>
  );
};
