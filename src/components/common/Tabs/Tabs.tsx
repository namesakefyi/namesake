import { focusRing } from "@/components/utils";
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
  base: "grid bg-gray-3 dark:bg-graydark-1 rounded-lg p-1",
  variants: {
    orientation: {
      horizontal: "grid-flow-col auto-cols-fr",
      vertical: "grid-flow-row auto-rows-fr",
    },
  },
});

export function TabList<T extends object>(props: TabListProps<T>) {
  return (
    <AriaTabList
      {...props}
      style={{ viewTransitionName: "tabs" }}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabListStyles({ ...renderProps, className }),
      )}
    />
  );
}

const tabProps = tv({
  extend: focusRing,
  base: "flex items-center justify-center relative cursor-pointer px-4 py-2 text-sm transition forced-color-adjust-none isolate",
  variants: {
    isSelected: {
      false: "text-gray-dim hover:text-gray-normal",
      true: "after:absolute after:inset-0 after:bg-white after:-z-10 after:rounded-md after:dark:bg-graydark-3 after:shadow-sm forced-colors:text-[HighlightText] forced-colors:bg-[Highlight]",
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
      style={{ viewTransitionName: String(props.id) }}
      className={composeRenderProps(
        props.className,
        (className, renderProps) => {
          // console.log(renderProps);
          return tabProps({ ...renderProps, className });
        },
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
