import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "../utils";

const tabsStyles = tv({
  base: "flex gap-4",
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "flex-row w-[800px]",
    },
  },
});

export function Tabs(props: TabsProps) {
  return (
    <AriaTabs
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabsStyles({ ...renderProps, className }),
      )}
    />
  );
}

const tabListStyles = tv({
  base: "flex gap-1",
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col items-start",
    },
  },
});

export function TabList<T extends object>(props: TabListProps<T>) {
  return (
    <AriaTabList
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabListStyles({ ...renderProps, className }),
      )}
    />
  );
}

const tabProps = tv({
  extend: focusRing,
  base: "flex items-center cursor-pointer rounded-full px-4 py-1.5 text-sm transition forced-color-adjust-none",
  variants: {
    isSelected: {
      false: "bg-gray-ghost text-gray-dim hover:text-gray-normal",
      true: "bg-gray-12 text-gray-1 dark:bg-graydark-12 dark:text-graydark-1 forced-colors:text-[HighlightText] forced-colors:bg-[Highlight]",
    },
    isDisabled: {
      true: "opacity-50 cursor-default forced-colors:text-[GrayText] selected:text-gray-3 dark:selected:text-gray-5 forced-colors:selected:text-[HighlightText] selected:bg-gray-2 dark:selected:bg-gray-6 forced-colors:selected:bg-[GrayText]",
    },
  },
});

export function Tab(props: TabProps) {
  return (
    <AriaTab
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabProps({ ...renderProps, className }),
      )}
    />
  );
}

const tabPanelStyles = tv({
  extend: focusRing,
  base: "flex-1",
});

export function TabPanel(props: TabPanelProps) {
  return (
    <AriaTabPanel
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabPanelStyles({ ...renderProps, className }),
      )}
    />
  );
}
