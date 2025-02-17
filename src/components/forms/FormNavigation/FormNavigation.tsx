import {
  Button,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Menu as MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface FormSection {
  hash: string;
  title: string;
}

export function FormNavigation() {
  const [formSections, setFormSections] = useState<FormSection[]>([]);
  const [activeSection, setActiveSection] = useState<{
    previous: FormSection | null;
    current: FormSection | null;
    next: FormSection | null;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const formSections = Array.from(
      document.querySelectorAll("[data-form-section]"),
    );
    setFormSections(
      formSections.map((section) => ({
        hash: section.id,
        title: section.querySelector("[data-section-title]")?.textContent ?? "",
      })),
    );
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const section = formSections.find(
            (section) => section.hash === entry.target.id,
          );
          if (section) {
            const index = formSections.findIndex(
              (s) => s.hash === section.hash,
            );
            setActiveSection({
              previous: formSections[index - 1],
              current: section,
              next: formSections[index + 1],
            });
            router.navigate({ to: ".", hash: section.hash });
          }
        }
      }
    };

    for (const section of formSections) {
      const element = document.getElementById(section.hash);
      if (element) {
        const observer = new IntersectionObserver(observerCallback, {
          threshold: 0.5,
          rootMargin: "-50px 0px -50px 0px",
        });
        observer.observe(element);
        observers.push(observer);
      }
    }

    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, [formSections, router]);

  return (
    <nav className="fixed right-4 top-4 flex gap-2">
      <TooltipTrigger>
        <Link
          href={{ to: ".", hash: activeSection?.previous?.hash }}
          button={{ variant: "icon" }}
          className="flex-1"
          aria-label="Previous question"
          isDisabled={!activeSection?.previous}
        >
          <ArrowUp className="size-5" />
        </Link>
        <Tooltip>Previous question</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <Link
          href={{ to: ".", hash: activeSection?.next?.hash }}
          button={{ variant: "icon" }}
          className="flex-1"
          aria-label="Next question"
          isDisabled={!activeSection?.next}
        >
          <ArrowDown className="size-5" />
        </Link>
        <Tooltip>Next question</Tooltip>
      </TooltipTrigger>
      <MenuTrigger>
        <TooltipTrigger>
          <Button variant="icon" icon={MenuIcon} aria-label="All questions" />
          <Tooltip>All questions</Tooltip>
        </TooltipTrigger>
        <Menu>
          {formSections.map(({ hash, title }) => (
            <MenuItem key={hash} href={{ to: ".", hash }}>
              {title}
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
    </nav>
  );
}
