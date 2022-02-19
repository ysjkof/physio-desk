import { cls } from "../libs/utils";

interface IScheduleBox {
  // gridRowStart: number;
  // gridRowEnd: number;
  hhmm: string;
  memo: string | null;
  startDate: string;
  endDate: string;
  shrink?: boolean;
}

export const ScheduleBox: React.FC<IScheduleBox> = ({
  // gridRowStart,
  // gridRowEnd,
  hhmm,
  children,
  memo,
  startDate,
  endDate,
  shrink = false,
}) => {
  const onClick = () => {
    console.log("you click ScheduleBox");
  };
  return (
    <div
      className={cls(
        "group relative col-start-2 rounded-lg border bg-white hover:cursor-pointer hover:border-transparent hover:ring-2 hover:ring-gray-900",
        shrink ? "w-[146px]" : ""
      )}
      // style={{
      //   gridRowStart,
      //   gridRowEnd,
      // }}
      id={hhmm}
      onClick={onClick}
    >
      {children}
      <span className="block text-sm text-gray-600">{memo}</span>
      <div className="absolute right-4 -bottom-3 hidden rounded-lg border bg-white px-4 text-gray-500 group-hover:block">
        {startDate}~{endDate}
      </div>
    </div>
  );
};
