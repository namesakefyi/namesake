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
  <div className="flex justify-between items-center gap-8 p-4">
    <div className="self-start">
      <Heading className="text-base -mt-px">{label}</Heading>
      {description && (
        <p className="text-xs text-gray-dim text-balance mt-0.5">
          {description}
        </p>
      )}
    </div>
    <div>{children}</div>
  </div>
);
