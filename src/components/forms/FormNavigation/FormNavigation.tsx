import { Button, ProgressBar } from "@/components/common";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Heading } from "react-aria-components";
import { useFormContext } from "react-hook-form";

interface FormNavigationProps {
  title: string;
}

export function FormNavigation({ title }: FormNavigationProps) {
  const [progress, setProgress] = useState(0);
  const { getValues, watch } = useFormContext();

  useEffect(() => {
    const subscription = watch((values) => {
      const allValues = values || getValues();
      const totalFields = Object.keys(allValues).length;
      const completedFields = Object.entries(allValues).filter(
        ([_, value]) => value !== null && value !== undefined && value !== "",
      ).length;
      setProgress(totalFields > 0 ? (completedFields / totalFields) * 100 : 0);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [watch, getValues]);

  return (
    <nav className="sticky bg-app p-2 top-0 flex items-center justify-between gap-2 border-b border-gray-a3">
      <div className="flex gap-2 items-center">
        <Button variant="icon" icon={ArrowLeft} aria-label="Back" />
        <Heading className="text-xl">{title}</Heading>
      </div>
      <div className="flex gap-2 items-center">
        <ProgressBar
          value={progress}
          label="Progress"
          labelHidden
          className="w-64 mr-3"
        />
        {/* <TooltipTrigger>
          <Link
            href={{ to: ".", hash: activeSection?.previous?.hash }}
            routerOptions={{ replace: true }}
            button={{ variant: "icon" }}
            aria-label="Previous question"
            isDisabled={!activeSection?.previous}
          >
            <ArrowUp className="size-5" />
          </Link>
          <Tooltip placement="bottom">Previous question</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <Link
            href={{ to: ".", hash: activeSection?.next?.hash }}
            routerOptions={{ replace: true }}
            button={{ variant: "icon" }}
            aria-label="Next question"
            isDisabled={!activeSection?.next}
          >
            <ArrowDown className="size-5" />
          </Link>
          <Tooltip placement="bottom">Next question</Tooltip>
        </TooltipTrigger>
        <MenuTrigger>
          <TooltipTrigger>
            <Button variant="icon" icon={MenuIcon} aria-label="All questions" />
            <Tooltip placement="bottom">All questions</Tooltip>
          </TooltipTrigger>
          <Menu>
            {formSections.map(({ hash, title }) => (
              <MenuItem
                key={hash}
                href={{ to: ".", hash }}
                routerOptions={{ replace: true }}
              >
                {title}
              </MenuItem>
            ))}
          </Menu>
        </MenuTrigger> */}
      </div>
    </nav>
  );
}
