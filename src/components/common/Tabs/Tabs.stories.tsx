import type { Meta } from "@storybook/react-vite";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  component: Tabs,
};

export default meta;

export const Example = (args: any) => (
  <Tabs {...args}>
    <TabList aria-label="History of Ancient Rome">
      <Tab id="FoR">Founding of Rome</Tab>
      <Tab id="MaR">Monarchy and Republic</Tab>
      <Tab id="Emp" isDisabled>
        Empire
      </Tab>
    </TabList>
    <TabPanel id="FoR">Arma virumque cano, Troiae qui primus ab oris.</TabPanel>
    <TabPanel id="MaR">Senatus Populusque Romanus.</TabPanel>
    <TabPanel id="Emp">Alea jacta est.</TabPanel>
  </Tabs>
);
