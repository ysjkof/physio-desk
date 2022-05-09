interface DashboardTitleProps {
  name: string;
  subText: string;
  children?: React.ReactNode;
}

export const DashboardTitle = ({
  name,
  subText,
  children,
}: DashboardTitleProps) => {
  return (
    <h2 className="mb-3 bg-white px-2 pt-2 pb-1.5 shadow-cst">
      <span className="text-3xl font-semibold">{name}</span>
      <span className="">{subText}</span>
      {children}
    </h2>
  );
};
