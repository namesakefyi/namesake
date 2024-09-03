import { type LinkProps, useMatchRoute } from "@tanstack/react-router";
import { Link } from ".";

interface NavProps {
  routes: {
    href: LinkProps;
    label: string;
  }[];
}

import { tv } from "tailwind-variants";
import { focusRing } from "../utils";

const styles = tv({
  extend: focusRing,
  base: "rounded-lg no-underline text-gray-dim hover:text-gray-normal py-1 aria-current:font-semibold aria-current:text-gray-normal",
});

export const Nav = ({ routes }: NavProps) => {
  const matchRoute = useMatchRoute();

  return (
    <nav className="flex flex-col w-[160px] shrink-0 pt-5 pl-6">
      {routes.map(({ href, label }) => {
        const current = matchRoute({ ...href, fuzzy: true });

        return (
          <Link
            key={href.to}
            href={{ ...href }}
            className={styles()}
            aria-current={current ? "true" : null}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
