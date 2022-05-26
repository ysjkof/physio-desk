import { useReactiveVar } from "@apollo/client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  compareDateMatch,
  getWeeksOfMonth,
} from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { selectedDateVar } from "../../../store";
import { MoveXBtn } from "./move-x-btn";

export function TableNavExpand() {
  const selectedDate = useReactiveVar(selectedDateVar);
  const [daysOfMonths, setDaysOfMonths] = useState<
    [{ date: Date }[], { prevMonth: Date; nowMonth: Date; nextMonth: Date }]
  >([getWeeksOfMonth(selectedDate), getThreeDate(selectedDate)]);

  function getThreeDate(date: Date) {
    const prevMonth = new Date(date);
    const nowMonth = new Date(date);
    const nextMonth = new Date(date);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return { prevMonth, nowMonth, nextMonth };
  }
  const onClickMoveX = (option: "prevMonth" | "nextMonth") => {
    const months = getWeeksOfMonth(daysOfMonths[1][option]);
    const threeDate = getThreeDate(daysOfMonths[1][option]);
    setDaysOfMonths([months, threeDate]);
  };
  return (
    <motion.div
      className="my-4 flex items-center justify-between pb-4 shadow-b"
      initial={{ y: -20 }}
      animate={{ y: 0, transition: { type: "tween" } }}
    >
      <MoveXBtn direction={"prev"} onClick={() => onClickMoveX("prevMonth")} />
      <div className="grid w-full grid-cols-7">
        {daysOfMonths[0].map((day, i) => (
          <div
            key={i}
            onClick={() => selectedDateVar(day.date)}
            className={cls(
              "flex w-full cursor-pointer flex-col text-center hover:border-b-gray-500 hover:font-extrabold",
              compareDateMatch(day.date, selectedDate, "ymd")
                ? "border-b-2 border-sky-400 font-bold"
                : "border-b-2 border-transparent"
            )}
          >
            <span
              className={cls(
                "rounded-full",
                day.date.getDay() === 0
                  ? "text-red-600"
                  : day.date.getDay() === 6
                  ? "text-blue-600"
                  : "text-gray-600",
                selectedDate.getDate() === day.date.getDate()
                  ? "scale-110 opacity-100"
                  : "opacity-80",
                daysOfMonths[0][7].date.getMonth() !== day.date.getMonth()
                  ? "opacity-30"
                  : ""
              )}
            >
              {day.date.getDate()}
            </span>
          </div>
        ))}
      </div>
      <MoveXBtn direction={"after"} onClick={() => onClickMoveX("nextMonth")} />
    </motion.div>
  );
}