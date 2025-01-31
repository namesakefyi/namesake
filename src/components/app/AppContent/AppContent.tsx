type AppContentProps = {
  children: React.ReactNode;
};

export const AppContent = ({ children }: AppContentProps) => {
  return (
    <main className="flex-1 w-full max-w-[960px] mx-auto app-padding">
      {children}
    </main>
  );
};
