import { lazy, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSchedules, useSubscriptions, useTableLabel } from './hooks';
import { MUOOL } from '../../constants/constants';
import {
  CreatePatient,
  EventList,
  ReserveOrDayoff,
  Schedules,
  TableController,
  TimeLabels,
  TimetableTemplate,
} from './components';
import { setToast, useStore } from '../../store';
import { useMe } from '../../hooks';

import type { LocationState } from '../../types/commonTypes';

const Loading = lazy(() => import('../../components/Loading'));

const TimeTable = () => {
  const { labels } = useTableLabel();
  const { schedules, members, variables } = useSchedules();
  useSubscriptions({ variables });

  const locationState = useLocation().state as LocationState;

  const navigate = useNavigate();
  const clearLocationState = () => {
    navigate('', { state: null });
  };

  const [meData] = useMe();

  if (schedules && meData && !meData.verified) {
    setToast({
      messages: ['이메일 인증을 하면 모든 기능을 사용할 수 있습니다.'],
    });
  }

  const pickedDate = useStore((state) => state.pickedDate);

  useEffect(() => {
    clearLocationState();
  }, []);

  if (!schedules) return <Loading />;

  return (
    <>
      <Helmet>
        <title>시간표 | {MUOOL}</title>
      </Helmet>
      <TimetableTemplate
        nav={<TableController members={members} />}
        labels={<TimeLabels labels={labels} />}
        columns={
          <AnimatePresence>
            <Schedules labels={labels} weekEvents={schedules} />
          </AnimatePresence>
        }
        eventList={<EventList events={[schedules[pickedDate.getDay()]][0]} />}
      />
      {locationState?.createReservation && <ReserveOrDayoff />}
      {locationState?.createPatient && <CreatePatient />}
    </>
  );
};

export default TimeTable;
