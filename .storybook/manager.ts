import { addons } from "storybook/manager-api";

addons.setConfig({
  sidebar: {
    showRoots: true,
  },
  toolbar: {
    title: { hidden: true },
    zoom: { hidden: true },
    eject: { hidden: true },
    copy: { hidden: true },
    fullscreen: { hidden: true },
  },
});
