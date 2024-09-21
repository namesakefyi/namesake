import type { RemixiconComponentType } from "@remixicon/react";
import { type LinkProps, useMatchRoute } from "@tanstack/react-router";
import { tv } from "tailwind-variants";
import { Link } from "../Link";
import { focusRing } from "../utils";

interface NavProps {
  routes: {
    icon: {
      default: RemixiconComponentType;
      active: RemixiconComponentType;
    };
    href: LinkProps;
    label: string;
  }[];
}

const styles = tv({
  extend: focusRing,
  base: "rounded-lg no-underline flex items-center gap-2 text-gray-dim hover:text-gray-normal py-1 aria-current:font-semibold aria-current:text-gray-normal",
});

export const Nav = ({ routes }: NavProps) => {
  const matchRoute = useMatchRoute();

  return (
    <nav className="flex flex-col w-[160px] shrink-0 pt-5 pl-6">
      {routes.map(({ href, label, icon }) => {
        const current = matchRoute({ ...href, fuzzy: true });
        const { default: DefaultIcon, active: ActiveIcon } = icon;

        return (
          <Link
            key={href.to}
            href={{ ...href }}
            className={styles()}
            aria-current={current ? "true" : null}
          >
            {current ? <ActiveIcon /> : <DefaultIcon />}
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
