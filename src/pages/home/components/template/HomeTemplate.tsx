import useWindowSize from '../../../../hooks/useWindowSize';
import { ChildrenProps } from '../../../../types/common.types';

export default function HomeTemplate({ children }: ChildrenProps) {
  const { height } = useWindowSize(true);
  return (
    <div className="h-full overflow-y-scroll text-base" style={{ height }}>
      {children}
    </div>
  );
}
