import { cls, getMemberState } from '../../../../utils/commonUtils';
import TimeIndicatorBar from '../TimeIndicatorBar';
import ReservationButtons from './ReserveButtons';
import EventBoxContainer from './EventBoxContainer';
import { useStore } from '../../../../store';
import { TABLE_CELL_HEIGHT } from '../../../../constants/constants';
import type { ScheduleBoxProps } from '../../../../types/propsTypes';

const ScheduleBox = ({
  userLength,
  enableTimeIndicator,
  members,
  date,
  labelMaxLength,
  labels,
}: ScheduleBoxProps) => {
  const hiddenUsers = useStore((state) => state.hiddenUsers);

  return (
    <div
      className={cls(
        'relative flex gap-2',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
    >
      <TimeIndicatorBar isActive={enableTimeIndicator} />
      {members.map((member, userIndex) => {
        const { id, accepted, manager, staying } = member;

        if (hiddenUsers.has(id)) return null;

        const state = getMemberState({ accepted, manager, staying });

        return (
          <div
            key={member.id}
            className={cls(
              'schedules__each-user-column',
              state === '탈퇴' ? 'border bg-gray-200/50 hover:bg-none' : ''
            )}
            style={{ height: labels.length * TABLE_CELL_HEIGHT }}
          >
            {state === '탈퇴' || (
              <ReservationButtons
                labelMaxLength={labelMaxLength}
                date={date}
                labels={labels}
                userId={member.user.id}
                userIndex={userIndex}
              />
            )}
            <EventBoxContainer
              labelMaxLength={labelMaxLength}
              labels={labels}
              events={member.events}
              userIndex={userIndex}
              isSingleUser={userLength === 1}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleBox;
