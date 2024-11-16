import type { Status } from "@convex/constants";
import type { Meta } from "@storybook/react";
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

export const WithCoreStatuses = (args: any) => <StatusSelect {...args} />;

WithCoreStatuses.args = {
  status: "readyToFile",
  onChange: (status: Status) => console.log("Status changed to:", status),
  isCore: true,
};
