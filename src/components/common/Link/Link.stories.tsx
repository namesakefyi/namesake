import { Link } from "@/components/common";
import type { Meta } from "@storybook/react-vite";

const meta: Meta<typeof Link> = {
  component: Link,
};

export default meta;

export const Example = (args: any) => <Link {...args}>The missing link</Link>;

Example.args = {
  href: "https://www.imdb.com/title/tt6348138/",
  target: "_blank",
};
