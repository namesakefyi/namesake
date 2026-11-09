import { Banner } from "#components/common/Banner";

const EXAMPLES = {
  self: [
    "I want a name which aligns with my gender identity.",
    "This is the name everyone knows me by.",
    "This is my preferred name and I wish to obtain proper documentation.",
    "I am transgender.",
  ],
  child: [
    "They want a name which aligns with their gender identity.",
    "This is the name everyone knows them by.",
    "This is their preferred name and they wish to obtain proper documentation.",
    "They are transgender.",
  ],
};

export interface NameChangeReasonBannerProps {
  /** Whose name is changing, which sets the voice of the examples. */
  for?: keyof typeof EXAMPLES;
}

export function NameChangeReasonBanner({
  for: person = "self",
}: NameChangeReasonBannerProps) {
  return (
    <Banner>
      <p>
        <strong>What do I write?</strong> Provide a basic reason—no need to go
        into detail. Examples:
      </p>
      <ul>
        {EXAMPLES[person].map((example) => (
          <li key={example}>“{example}”</li>
        ))}
      </ul>
    </Banner>
  );
}
