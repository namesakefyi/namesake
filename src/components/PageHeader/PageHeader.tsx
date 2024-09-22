export interface PageHeaderProps {
  title: string;
  badge?: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({
  title,
  badge,
  subtitle,
  children,
}: PageHeaderProps) => {
  return (
    <header className="flex items-center justify-between pb-6 gap-6 text-gray-normal">
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="text-gray-dim">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
};
