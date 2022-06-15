import {
  combineYMDHM,
  compareNumAfterGetMinutes,
  DayWithUsers,
} from "../../../libs/timetable-utils";
import { ReserveBtn } from "../molecules/reserve-btn";
import { TableLoopLayout } from "./templates/table-loop-layout";
import { TableMainComponentLayout } from "./templates/table-main-component-layout";

interface TableRowProps {
  weekEvents: DayWithUsers[];
  labels: Date[];
}

export function TableRows({ weekEvents, labels }: TableRowProps) {
  const userLength = weekEvents[0].users.length;

  return (
    <TableMainComponentLayout componentName="table-rows">
      {labels.map((label, i) => (
        <TableLoopLayout
          key={i}
          userLength={userLength}
          isActiveBorderTop={compareNumAfterGetMinutes(label, [0, 30])}
          children={weekEvents.map((day, ii) => (
            <div key={ii} className="relative flex">
              {day?.users.map(
                (member, userIndex) =>
                  member.activation && (
                    <ReserveBtn
                      key={userIndex}
                      label={combineYMDHM(day.date, label)}
                      userIndex={userIndex}
                      member={{ id: member.user.id, name: member.user.name }}
                    />
                  )
              )}
            </div>
          ))}
        />
      ))}
    </TableMainComponentLayout>
  );
}