import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
} from "react-aria-components";
import styles from "./Tabs.module.css";

export function Tabs(props: TabsProps) {
  return <AriaTabs {...props} className={styles.tabs} />;
}

export function TabList<T extends object>(props: TabListProps<T>) {
  return <AriaTabList {...props} className={styles["tab-list"]} />;
}

export function Tab(props: TabProps) {
  return (
    <AriaTab
      {...props}
      className={`focus-ring ${styles.tab}`}
      style={{ viewTransitionName: String(props.id) }}
    />
  );
}

export function TabPanel(props: TabPanelProps) {
  return (
    <AriaTabPanel {...props} className={`focus-ring ${styles["tab-panel"]}`} />
  );
}
