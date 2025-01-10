import { Tag, TagGroup, TextField } from "@/components/common";
import { COMMON_PRONOUNS } from "@convex/constants";
import { useState } from "react";
import type { Selection } from "react-aria-components";

export function PronounSelectField() {
  const [selected, setSelected] = useState<Selection>(new Set([]));

  return (
    <div className="flex flex-col gap-4">
      <TagGroup
        label="Pronouns"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        size="large"
      >
        {COMMON_PRONOUNS.map((pronoun) => (
          <Tag key={pronoun} id={pronoun}>
            {pronoun}
          </Tag>
        ))}
        <Tag id="other">other pronouns</Tag>
      </TagGroup>
      {(selected === "all" || selected.has("other")) && (
        <TextField
          label="List other pronouns"
          name="otherPronouns"
          size="large"
        />
      )}
    </div>
  );
}
