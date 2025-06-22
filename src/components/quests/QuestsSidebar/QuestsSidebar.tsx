import {
  AppNav,
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarHeader,
  NamesakeHeader,
} from "@/components/app";
import { Button, Tooltip, TooltipTrigger } from "@/components/common";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Search, X } from "lucide-react";
import { AllQuests } from "./AllQuests";
import { MyQuests } from "./MyQuests";
import {
  QuestsSidebarProvider,
  useQuestsSidebar,
} from "./QuestsSidebarProvider";

const QuestsSidebarContent = () => {
  const isMobile = useIsMobile();
  const { activeTab, setActiveTab } = useQuestsSidebar();

  const handleTabSwitch = (tab: "user" | "all") => {
    setActiveTab(tab);
  };

  return (
    <AppSidebar>
      <AppSidebarHeader>
        <NamesakeHeader onLogoPress={() => handleTabSwitch("user")}>
          <TooltipTrigger>
            <Button
              aria-label={
                activeTab === "user" ? "Browse all quests" : "Back to my quests"
              }
              variant="icon"
              onPress={() =>
                handleTabSwitch(activeTab === "user" ? "all" : "user")
              }
              icon={activeTab === "user" ? Search : X}
              className="ml-auto -mr-2"
            />
            <Tooltip placement="right">
              {activeTab === "user" ? "Browse all quests" : "Back to my quests"}
            </Tooltip>
          </TooltipTrigger>
        </NamesakeHeader>
      </AppSidebarHeader>
      <AppSidebarContent>
        {activeTab === "user" ? <MyQuests /> : <AllQuests />}
      </AppSidebarContent>
      {!isMobile && (
        <AppSidebarFooter>
          <AppNav />
        </AppSidebarFooter>
      )}
    </AppSidebar>
  );
};

export const QuestsSidebar = () => {
  return (
    <QuestsSidebarProvider>
      <QuestsSidebarContent />
    </QuestsSidebarProvider>
  );
};
