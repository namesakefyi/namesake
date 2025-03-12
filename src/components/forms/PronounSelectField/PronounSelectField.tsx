import { Tag, TagGroup, TextField } from "@/components/common";
import { COMMON_PRONOUNS } from "@convex/constants";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { Controller, useFormContext } from "react-hook-form";

export function PronounSelectField() {
  const { control } = useFormContext();
  const [selected, setSelected] = useState<Selection>(new Set([]));

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name="pronouns"
        render={({ field, fieldState: { error } }) => (
          <TagGroup
            {...field}
            label="Pronouns"
            selectionMode="multiple"
            selectedKeys={selected}
            onSelectionChange={(selection) => {
              setSelected(selection);
              field.onChange(Array.from(selection));
            }}
            size="large"
            errorMessage={error?.message}
          >
            {COMMON_PRONOUNS.map((pronoun) => (
              <Tag key={pronoun} id={pronoun}>
                {pronoun}
              </Tag>
            ))}
            <Tag id="other">other pronouns</Tag>
          </TagGroup>
        )}
      />
      {(selected === "all" || selected.has("other")) && (
        <Controller
          control={control}
          defaultValue=""
          name="otherPronouns"
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              label="List other pronouns"
              size="large"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />
      )}
    </div>
  );
}
