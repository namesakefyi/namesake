import type { Meta } from "@storybook/react-vite";
import {
  Code,
  File,
  FileText,
  Folder,
  FolderOpen,
  Image,
  Music,
  Video,
} from "lucide-react";
import { Tree, TreeItem } from "./Tree";

const meta: Meta<typeof Tree> = {
  component: Tree,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

export const Example = (args: any) => (
  <Tree title="Files" style={{ height: "400px", width: "300px" }} {...args}>
    <TreeItem id="documents" label="Documents">
      <TreeItem id="project" label="Project" />
    </TreeItem>
    <TreeItem id="photos" label="Photos">
      <TreeItem id="one" label="Image 1" />
      <TreeItem id="two" label="Image 2" />
    </TreeItem>
  </Tree>
);

Example.args = {
  onAction: null,
  defaultExpandedKeys: ["documents", "photos", "project"],
  selectionMode: "multiple",
  defaultSelectedKeys: ["project"],
};

export const DisabledItems = (args: any) => <Example {...args} />;
DisabledItems.args = {
  ...Example.args,
  disabledKeys: ["photos"],
};

export const WithIcons = (args: any) => (
  <Tree
    title="File Explorer"
    style={{ height: "400px", width: "350px" }}
    {...args}
  >
    <TreeItem
      id="documents"
      label="Documents"
      icon={[Folder, FolderOpen]}
      href="/"
    >
      <TreeItem id="readme" label="README.md" icon={FileText} href="/" />
      <TreeItem id="config" label="config.json" icon={Code} href="/" />
    </TreeItem>
    <TreeItem id="media" label="Media" icon={[Folder, FolderOpen]} href="/">
      <TreeItem id="images" label="Images" icon={[Folder, FolderOpen]} href="/">
        <TreeItem id="photo1" label="vacation.jpg" icon={Image} href="/" />
        <TreeItem id="photo2" label="portrait.png" icon={Image} href="/" />
      </TreeItem>
      <TreeItem id="audio" label="Audio" icon={[Folder, FolderOpen]} href="/">
        <TreeItem id="song1" label="favorite.mp3" icon={Music} href="/" />
        <TreeItem id="song2" label="podcast.wav" icon={Music} href="/" />
      </TreeItem>
      <TreeItem id="video1" label="presentation.mp4" icon={Video} href="/" />
    </TreeItem>
    <TreeItem
      id="project"
      label="Project Files"
      icon={[Folder, FolderOpen]}
      href="/"
    >
      <TreeItem id="src" label="src" icon={[Folder, FolderOpen]} href="/">
        <TreeItem id="main" label="main.tsx" icon={Code} href="/" />
        <TreeItem id="utils" label="utils.ts" icon={Code} href="/" />
      </TreeItem>
      <TreeItem id="package" label="package.json" icon={File} href="/" />
    </TreeItem>
  </Tree>
);

WithIcons.args = {
  onAction: null,
  defaultExpandedKeys: ["documents", "media", "images", "project"],
  selectionMode: "none",
  defaultSelectedKeys: ["readme", "photo1"],
};
