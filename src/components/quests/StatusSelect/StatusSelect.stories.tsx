import type { Meta } from "@storybook/react-vite";
import type { Status } from "@/constants";
import { StatusSelect } from "./StatusSelect";

const meta: Meta<typeof StatusSelect> = {
  component: StatusSelect,
};

export default meta;

export const Example = (args: any) => <StatusSelect {...args} />;

Example.args = {
  status: "notStarted",
  onChange: (status: Status) => console.log("Status changed to:", status),
};
