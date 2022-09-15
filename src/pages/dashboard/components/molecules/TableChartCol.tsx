import { ReactNode } from 'react';
import DashboardLi from './DashboardLi';

interface TableChartColProps {
  title?: string;
  titleBorderRight?: boolean;
  children: ReactNode;
}
export default function TableChartCol({
  title,
  titleBorderRight,
  children,
}: TableChartColProps) {
  return (
    <div className="TABLE_CHART_COL flex w-full flex-col">
      {title ? (
        <DashboardLi
          borderRight={titleBorderRight}
          textCenter
          borderBottom
          textContents={title}
        />
      ) : (
        ''
      )}
      {children}
    </div>
  );
}
