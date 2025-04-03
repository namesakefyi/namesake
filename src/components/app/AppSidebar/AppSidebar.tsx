type AppSidebarProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const AppSidebar = ({ header, children, footer }: AppSidebarProps) => {
  return (
    <div className="w-72 lg:w-80 xl:w-[22rem] flex flex-col shrink-0 sticky top-0 max-h-full align-self-stretch overflow-y-auto bg-sidebar border-r border-gray-a4">
      {header && (
        <div className="app-padding h-header shrink-0 sticky top-0 bg-sidebar z-20">
          {header}
        </div>
      )}
      <div className="app-padding flex-1">{children}</div>
      {footer && (
        <div className="app-padding h-header -ml-3 shrink-0 flex items-center sticky bottom-0 bg-sidebar">
          {footer}
        </div>
      )}
    </div>
  );
};
