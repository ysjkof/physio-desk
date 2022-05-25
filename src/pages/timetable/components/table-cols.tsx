import {
  compareDateMatch,
  DayWithUsers,
  getTimeLength,
} from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { EventBox } from "./event-box";

interface TableColsProps {
  weekEvents: DayWithUsers[];
  isWeek: boolean;
  labels: Date[];
  onClick: (eventId: number) => void;
}
export function TableCols({
  weekEvents,
  isWeek,
  labels,
  onClick,
}: TableColsProps) {
  if (!weekEvents[0]) {
    console.log("❌ weekEvents[0]가 false입니다 : ", weekEvents);
    return <h2>Loading...</h2>;
  }
  return (
    <div className="col-table absolute h-full w-full">
      <div
        className={cls(
          "grid h-full",
          isWeek ? "grid-cols-week" : "grid-cols-day"
        )}
      >
        <div className="title-col" />
        {weekEvents.map((day, i) => (
          <div
            key={i}
            className="event-col relative grid"
            style={{
              gridTemplateColumns: `repeat(${
                day.users.filter((member) => member.activation).length
              }, 1fr)`,
            }}
          >
            {day.users.map(
              (member, userIndex) =>
                member.activation && (
                  <div key={member.id} className={cls("user-col relative")}>
                    {member.events?.map((event) => (
                      <EventBox
                        key={event.id}
                        userIndex={userIndex}
                        reservationState={event.state}
                        patientName={event.patient.name}
                        prescriptions={event.prescriptions ?? []}
                        inset={`${
                          labels.findIndex((label) =>
                            compareDateMatch(
                              label,
                              new Date(event.startDate),
                              "hm"
                            )
                          ) * 20
                        }px 0%`}
                        height={`${
                          getTimeLength(event.startDate, event.endDate) * 2
                        }px`}
                        onClick={() => onClick(event.id)}
                      />
                    ))}
                  </div>
                )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
