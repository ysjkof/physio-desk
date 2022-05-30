import { useEffect, useState } from "react";

interface ITimeIndicatorBarProps {
  labels: Date[];
  isActive: boolean;
}

export const TimeIndicatorBar = ({
  labels,
  isActive,
}: ITimeIndicatorBarProps) => {
  const [top, setTop] = useState<number>();
  const startTime = labels[0].getTime() / 1000 / 60;
  const endTime = labels[labels.length - 1].getTime() / 1000 / 60;
  const setPosition = () => {
    const nowMinute = Date.now() / 1000 / 60;
    const nowTime = nowMinute - startTime;
    const maxTime = endTime - startTime;
    if (nowTime > maxTime) {
      //  시간표의 1칸은 10분을 나타내고 높이 20px이다.
      //  1분은 2px기 때문에 *2 한다.
      setTop(0);
    } else {
      setTop(Math.floor(nowTime * 2));
    }
  };

  useEffect(() => {
    setPosition();
    let id = setInterval(setPosition, 30000);
    return () => clearInterval(id);
  }, []);
  if (top === 0 || typeof top !== "number") return <></>;
  return (
    <div
      className="time-indicator-bar group pointer-events-none absolute z-20 flex w-full border-t"
      style={{ top: `${top + 50}px` }}
    >
      {isActive && (
        <span className="mx-auto text-red-500">
          {new Date().toLocaleString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </div>
  );
};
