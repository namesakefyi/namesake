import { createContext, useContext, useState } from "react";
import type { Category } from "@/constants";

type QuestsSidebarContextType = {
  activeTab: "user" | "all";
  categoryFilter: Category | undefined;
  setActiveTab: (tab: "user" | "all") => void;
  setCategoryFilter: (category: Category | undefined) => void;
};

const QuestsSidebarContext = createContext<
  QuestsSidebarContextType | undefined
>(undefined);

export const useQuestsSidebar = () => {
  const context = useContext(QuestsSidebarContext);
  if (!context) {
    throw new Error(
      "useQuestsSidebar must be used within a QuestsSidebarProvider",
    );
  }
  return context;
};

export const QuestsSidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeTab, setActiveTabState] = useState<"user" | "all">("user");
  const [categoryFilter, setCategoryFilterState] = useState<
    Category | undefined
  >(undefined);

  const setActiveTab = (tab: "user" | "all") => {
    setActiveTabState(tab);
    if (tab === "user") {
      setCategoryFilterState(undefined);
    }
  };

  const setCategoryFilter = (category: Category | undefined) => {
    setCategoryFilterState(category);
  };

  return (
    <QuestsSidebarContext.Provider
      value={{
        activeTab,
        categoryFilter,
        setActiveTab,
        setCategoryFilter,
      }}
    >
      {children}
    </QuestsSidebarContext.Provider>
  );
};
