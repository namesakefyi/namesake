import { focusRing } from "@/components/utils";
import { useContext } from "react";
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabListProps,
  TabListStateContext,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import styles from "./Tabs.module.css";

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
  base: "grid bg-gray-3 dark:bg-graydark-1 rounded-lg p-1 relative isolate after:absolute after:inset-0 after:bg-white after:-z-10 after:rounded-md after:shadow-sm after:dark:bg-graydark-3",
  variants: {
    orientation: {
      horizontal: "grid-flow-col auto-cols-fr",
      vertical: "grid-flow-row auto-rows-fr",
    },
  },
});

export function TabList<T extends object>(props: TabListProps<T>) {
  const state = useContext(TabListStateContext);

  const tabList = state?.collection;
  const activeTab = state?.selectedKey ?? "";

  const count = tabList?.size ?? 1;
  const active = tabList?.getItem(activeTab)?.index ?? 0;

  return (
    <AriaTabList
      {...props}
      className={composeRenderProps(
        `${props.className} ${styles["tab-list"]}`,
        (className, renderProps) =>
          tabListStyles({ ...renderProps, className }),
      )}
      style={{
        ["--count" as string]: count,
        ["--active" as string]: active,
      }}
    />
  );
}

const tabProps = tv({
  extend: focusRing,
  base: "flex items-center justify-center cursor-pointer rounded-md px-4 py-2 text-sm transition forced-color-adjust-none",
  variants: {
    isSelected: {
      false: "text-gray-dim hover:text-gray-normal",
      true: "forced-colors:text-[HighlightText] forced-colors:bg-[Highlight]",
    },
    isDisabled: {
      true: "opacity-50 cursor-default forced-colors:text-[GrayText] selected:text-gray-3 dark:selected:text-graydark-3 forced-colors:selected:text-[HighlightText] selected:bg-gray-2 dark:selected:bg-gray-6 forced-colors:selected:bg-[GrayText]",
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
