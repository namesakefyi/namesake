interface QuestDetailsProps {
  children: React.ReactNode;
}

export function QuestDetails({ children }: QuestDetailsProps) {
  return (
    <aside className="flex w-full border border-gray-dim rounded-lg divide-x divide-gray-dim">
      {children}
    </aside>
  );
}
