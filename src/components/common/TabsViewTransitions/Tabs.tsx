import { useEffect, useState } from "react";
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type Key,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
} from "react-aria-components";
import styles from "./Tabs.module.css";

export function Tabs(props: TabsProps) {
  const [key, setKey] = useState<Key>();

  useEffect(() => {
    console.log(props.selectedKey, key);
  }, [props.selectedKey, key]);

  const handleChange = (key: Key) => {
    props.onSelectionChange?.(key);
    setKey(key);
  };

  return (
    <AriaTabs
      {...props}
      className={styles.tabs}
      selectedKey={key}
      onSelectionChange={(key) => {
        if (!document.startViewTransition) return handleChange(key);
        document.startViewTransition(() => handleChange(key));
      }}
    />
  );
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
