import { focusRing } from "@/components/utils";
import { createContext, use, useContext } from "react";
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
  type TabListProps,
  TabListStateContext,
  type TabPanelProps,
  type TabProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import styles from "./Tabs.module.css";

const TabsSizeContext = createContext<"small" | "medium">("medium");

const tabsStyles = tv({
  base: "flex gap-4",
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "flex-row w-[800px]",
    },
    size: {
      small: "gap-2",
      medium: "gap-4",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface TabsProps extends AriaTabsProps {
  size?: "small" | "medium";
}

export function Tabs({ size = "medium", className, ...props }: TabsProps) {
  return (
    <TabsSizeContext value={size}>
      <AriaTabs
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
          tabsStyles({ ...renderProps, className }),
        )}
      />
    </TabsSizeContext>
  );
}

const tabListStyles = tv({
  base: "grid bg-theme-a3 dark:bg-theme-a2 rounded-lg p-1 relative isolate after:absolute after:inset-0 after:bg-white dark:after:bg-theme-a3 after:-z-10 after:rounded-md after:shadow-sm",
  variants: {
    orientation: {
      horizontal: "grid-flow-col auto-cols-fr",
      vertical: "grid-flow-row auto-rows-fr",
    },
    size: {
      small: "gap-2",
      medium: "gap-4",
    },
  },
});

export function TabList<T extends object>({
  className,
  ...props
}: TabListProps<T>) {
  const state = use(TabListStateContext);
  const size = useContext(TabsSizeContext);

  const tabList = state?.collection;
  const activeTab = state?.selectedKey ?? "";

  const count = tabList?.size ?? 1;
  const active = tabList?.getItem(activeTab)?.index ?? 0;

  return (
    <AriaTabList
      {...props}
      className={composeRenderProps(
        `${className} ${styles["tab-list"]}`,
        (className, renderProps) =>
          tabListStyles({ ...renderProps, size, className }),
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
  base: "flex items-center justify-center cursor-pointer rounded-md text-sm text-center transition forced-color-adjust-none",
  variants: {
    isSelected: {
      false: "text-dim hover:text-normal",
      true: "forced-colors:text-[HighlightText] forced-colors:bg-[Highlight]",
    },
    isDisabled: {
      true: "opacity-50 cursor-default forced-colors:text-[GrayText] selected:text-subtle forced-colors:selected:text-[HighlightText] selected:bg-theme-1 forced-colors:selected:bg-[GrayText]",
    },
    size: {
      small: "px-2 py-1",
      medium: "px-4 py-2",
    },
  },
});

export function Tab(props: TabProps) {
  const size = useContext(TabsSizeContext);

  return (
    <AriaTab
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabProps({ ...renderProps, size, className }),
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
