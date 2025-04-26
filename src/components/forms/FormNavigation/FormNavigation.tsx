import {
  Button,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  ProgressBar,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { useFormSections } from "@/hooks/useFormSections";
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
    <nav className="sticky bg-app p-2 top-0 max-w-full flex items-center justify-between gap-3 border-b border-gray-a3">
      <div className="flex gap-2 items-center min-w-0">
        <Link button={{ variant: "icon" }} href={{ to: "/" }} aria-label="Back">
          <ArrowLeft className="size-5" />
        </Link>
        <Heading className="text-xl truncate min-w-0 flex-1">{title}</Heading>
      </div>
      <div className="flex gap-1 items-center">
        <ProgressBar
          value={progress}
          label="Progress"
          labelHidden
          className="w-20 md:w-48 lg:w-64 mr-3"
        />
        <MenuTrigger>
          <TooltipTrigger>
            <Button
              variant="icon"
              icon={MenuIcon}
              aria-label="All questions"
              iconProps={{ className: "size-5" }}
              isDisabled={!sections.length}
            />
            <Tooltip placement="bottom">All questions</Tooltip>
          </TooltipTrigger>
          {sections.length > 0 && (
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
          )}
        </MenuTrigger>
      </div>
    </nav>
  );
}
