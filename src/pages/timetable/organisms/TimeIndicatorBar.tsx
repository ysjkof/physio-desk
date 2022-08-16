import { useEffect, useState } from 'react';
import {
  TABLE_CELL_HEIGHT,
  TABLE_TIME_GAP,
} from '../../../constants/constants';
import useStore from '../../../hooks/useStore';

interface ITimeIndicatorBarProps {
  labels: Date[];
  isActive: boolean;
}

export const TimeIndicatorBar = ({
  labels,
  isActive,
}: ITimeIndicatorBarProps) => {
  const { selectedDate } = useStore();
  const [top, setTop] = useState<number>();
  const startTime = labels[0].getTime() / 1000 / 60;
  const endTime = labels[labels.length - 1].getTime() / 1000 / 60;
  const setPosition = () => {
    const nowMinute = Date.now() / 1000 / 60; // 현재 시각을 분으로 변환
    const nowTime = nowMinute - startTime;
    const maxTime = endTime - startTime;
    if (nowTime > maxTime) {
      //  시간표의 1칸은 10분을 나타내고 높이 20px이다.
      //  1분은 2px기 때문에 *2 한다.
      setTop(0);
    } else {
      setTop(Math.floor((nowTime / TABLE_TIME_GAP) * TABLE_CELL_HEIGHT));
    }
  };

  useEffect(() => {
    setPosition();
    let id = setInterval(setPosition, 30000);
    return () => clearInterval(id);
  }, []);
  if (top === 0 || typeof top !== 'number') return <></>;
  return (
    <div className="time-indicator-bar" style={{ top: `${top}px` }}>
      {isActive && (
        <span className="mx-auto">
          {selectedDate.toLocaleString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      )}
    </div>
  );
};
