import {
  composeRenderProps,
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
  SelectionIndicator,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
} from "react-aria-components";
import "./Tabs.css";

export function Tabs(props: TabsProps) {
  return <RACTabs {...props} />;
}

export function TabList<T extends object>(props: TabListProps<T>) {
  return <RACTabList {...props} />;
}

export function Tab(props: TabProps) {
  return (
    <RACTab {...props}>
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <SelectionIndicator />
        </>
      ))}
    </RACTab>
  );
}

export function TabPanel(props: TabPanelProps) {
  return <RACTabPanel {...props} />;
}
