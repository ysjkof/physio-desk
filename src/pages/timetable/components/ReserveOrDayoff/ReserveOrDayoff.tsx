import { ButtonHTMLAttributes, useState, type PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { set, setDay } from 'date-fns';
import { Modal } from '../../../../components';
import { cls } from '../../../../utils/commonUtils';
import { FormForReservation } from '../FormForReservation';
import { useCloseModal } from '../../../../hooks';
import { FormForDayoff } from '../FormForDayoff';
import { useStore } from '../../../../store';
import type { IsActive, LocationState } from '../../../../types/commonTypes';

const ReserveOrDayoff = () => {
  const closeModal = useCloseModal();
  const {
    startDate: { hours, minutes, dayIndex },
    userId,
    isDayoff,
  } = useLocation().state as LocationState;

  const [isReserve, setIsReserve] = useState(!isDayoff);

  const pickedDate = useStore((state) => state.pickedDate);
  const date = setDay(set(pickedDate, { hours, minutes }), dayIndex);

  const seeReserve = () => setIsReserve(true);
  const seeDayoff = () => setIsReserve(false);

  return (
    <Modal closeAction={closeModal}>
      <div className="w-96">
        <Navigation>
          <Tab isActive={isReserve} onClick={seeReserve}>
            환자예약
          </Tab>
          <Tab isActive={!isReserve} onClick={seeDayoff}>
            예약잠금
          </Tab>
        </Navigation>
        <div className="h-[465px]">
          {isReserve ? (
            <FormForReservation
              closeAction={closeModal}
              date={date}
              userId={userId}
            />
          ) : (
            <FormForDayoff
              closeAction={closeModal}
              date={date}
              userId={userId}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReserveOrDayoff;

const Navigation = ({ children }: PropsWithChildren) => {
  return <div className="flex">{children}</div>;
};

interface TapProps
  extends PropsWithChildren,
    IsActive,
    ButtonHTMLAttributes<HTMLButtonElement> {}

const Tab = ({ isActive, children, ...args }: TapProps) => {
  return (
    <button
      className={cls(
        'modal-header m-0 h-16 p-0 text-2xl font-semibold',
        isActive ? '' : 'bg-table-bg text-[#74758E]'
      )}
      type="button"
      {...args}
    >
      {children}
    </button>
  );
};
