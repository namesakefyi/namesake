import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  ProgressBar,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { useFormSections } from "@/components/forms/FormSection/FormSectionContext";
import { ArrowLeft, MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Heading } from "react-aria-components";
import { useFormContext } from "react-hook-form";

interface FormNavigationProps {
  title: string;
}

export function FormNavigation({ title }: FormNavigationProps) {
  const { sections } = useFormSections();
  const [progress, setProgress] = useState(0);
  const { getValues, watch } = useFormContext();

  // Watch form values for progress
  useEffect(() => {
    const subscription = watch((values) => {
      const allValues = values || getValues();
      const totalFields = Object.keys(allValues).length;
      const completedFields = Object.entries(allValues).filter(
        ([_, value]) => value !== null && value !== undefined && value !== "",
      ).length;
      setProgress(totalFields > 0 ? (completedFields / totalFields) * 100 : 0);
    });

    return () => subscription.unsubscribe();
  }, [watch, getValues]);

  return (
    <nav className="sticky bg-app p-2 top-0 flex items-center justify-between gap-2 border-b border-gray-a3">
      <div className="flex gap-2 items-center">
        <Button
          variant="icon"
          icon={ArrowLeft}
          aria-label="Back"
          iconProps={{ className: "size-5" }}
        />
        <Heading className="text-xl text-ellipsis whitespace-nowrap">
          {title}
        </Heading>
      </div>
      <div className="flex gap-2 items-center">
        <ProgressBar
          value={progress}
          label="Progress"
          labelHidden
          className="w-24 md:w-48 lg:w-64 mr-3"
        />
        <MenuTrigger>
          <TooltipTrigger>
            <Button variant="icon" icon={MenuIcon} aria-label="All questions" />
            <Tooltip placement="bottom">All questions</Tooltip>
          </TooltipTrigger>
          <Menu>
            {sections.map(({ hash, title }) => (
              <MenuItem
                key={hash}
                href={{ to: ".", hash }}
                routerOptions={{ replace: true }}
              >
                {title}
              </MenuItem>
            ))}
          </Menu>
        </MenuTrigger>
      </div>
    </nav>
  );
}
