import { ChevronRight } from "lucide-react";
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  type BreadcrumbProps,
  type BreadcrumbsProps,
  type LinkProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { Link } from "../Link";
import { composeTailwindRenderProps } from "../utils";

export function Breadcrumbs<T extends object>(props: BreadcrumbsProps<T>) {
  return (
    <AriaBreadcrumbs
      {...props}
      className={twMerge("flex gap-1", props.className)}
    />
  );
}

export function Breadcrumb(
  props: BreadcrumbProps & Omit<LinkProps, "className">,
) {
  return (
    <AriaBreadcrumb
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex items-center gap-1",
      )}
    >
      <Link variant="secondary" {...props} />
      {props.href && (
        <ChevronRight className="w-4 h-4 text-gray-8 dark:text-graydark-8" />
      )}
    </AriaBreadcrumb>
  );
}
