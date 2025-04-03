import { Heading } from "react-aria-components";

type SettingsItemProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

export const SettingsItem = ({
  label,
  description,
  children,
}: SettingsItemProps) => (
  <div className="flex justify-between items-center gap-x-4 gap-y-3 min-h-16 py-3 px-4 border border-gray-dim first-of-type:rounded-t-lg last-of-type:rounded-b-lg not-first-of-type:border-t-0 not-last-of-type:border-b-gray-a3">
    <div>
      <Heading className="text-base -mt-px">{label}</Heading>
      {description && (
        <p className="text-xs text-gray-dim text-pretty mt-0.5 max-w-[40ch]">
          {description}
        </p>
      )}
    </div>
    <div>{children}</div>
  </div>
);
