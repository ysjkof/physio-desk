import { create } from 'zustand';
import { TABLE_TIME_GAP } from './constants/constants';
import {
  localStorageUtils,
  updateLocalStorageHiddenUsers,
} from './utils/localStorage.utils';
import type {
  ToastState,
  TableTimeOptions,
  PickedReservationType,
  UserIdAndName,
  ApolloClientType,
} from './types/common.types';
import type { HiddenUsersArr, HiddenUsersSet } from './types/store.types';

interface ZustandStoreState {
  isLoggedIn: boolean;
  client: ApolloClientType;
  pickedClinicId: number;
  toast: ToastState;
  isBigGlobalAside: boolean;
  isWeekCalendar: boolean;
  showSettingOfTimetable: boolean;
  showCancelOfTimetable: boolean;
  showNoshowOfTimetable: boolean;
  showCalendarOfTimetable: boolean;
  timeDurationOfTimetable: TableTimeOptions;
  hiddenUsers: HiddenUsersSet;
  pickedDate: Date;
  pickedReservation: PickedReservationType;
}

const initialState: ZustandStoreState = {
  isLoggedIn: false,
  client: null,
  pickedClinicId: 0,
  toast: {},
  isBigGlobalAside: true,
  isWeekCalendar: true,
  showSettingOfTimetable: false,
  showCancelOfTimetable: true,
  showNoshowOfTimetable: true,
  showCalendarOfTimetable: false,
  timeDurationOfTimetable: {
    firstHour: 9,
    firstMinute: 0,
    lastHour: 19,
    lastMinute: 0,
    gap: TABLE_TIME_GAP,
  },
  hiddenUsers: new Set(),
  pickedDate: new Date(),
  pickedReservation: undefined,
};

export const useStore = create<ZustandStoreState>(() => initialState);

// 전역

export const setAuthToken = (_token?: string) =>
  useStore.setState(() => {
    let token: string | null | undefined = _token;
    if (!_token) {
      token = localStorageUtils.get({ key: 'token' });
    }
    return { isLoggedIn: !!token };
  });

export const setClient = (client: ApolloClientType) =>
  useStore.setState(() => ({ client }));

export const setClinicId = (clinicId: number) =>
  useStore.setState(() => ({ pickedClinicId: clinicId }));

export const setToast = (props: ToastState) =>
  useStore.setState(() => ({ toast: props }));

export const setGlobalAside = (value?: boolean) =>
  useStore.setState((state) => ({
    isBigGlobalAside:
      typeof value === 'undefined' ? !state.isBigGlobalAside : value,
  }));

export const resetStore = () => useStore.setState(() => initialState);

// 시간표

export const toggleIsWeekCalendar = (value?: boolean) =>
  useStore.setState((state) => ({
    isWeekCalendar:
      typeof value === 'undefined' ? !state.isWeekCalendar : value,
  }));

export const toggleSettingOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    showSettingOfTimetable:
      typeof value === 'undefined' ? !state.showSettingOfTimetable : value,
  }));

export const setShowCancelOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    showCancelOfTimetable:
      typeof value === 'undefined' ? !state.showCancelOfTimetable : value,
  }));

export const setShowNoshowOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    showNoshowOfTimetable:
      typeof value === 'undefined' ? !state.showNoshowOfTimetable : value,
  }));
export const toggleShowCalendarOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    showCalendarOfTimetable:
      typeof value === 'undefined' ? !state.showCalendarOfTimetable : value,
  }));

export const setTimeDurationOfTimetable = (value: TableTimeOptions) =>
  useStore.setState(() => ({ timeDurationOfTimetable: value }));

export const setHiddenUsers = (value: HiddenUsersArr) =>
  useStore.setState(() => ({ hiddenUsers: new Set(value) }));

export const setPickedDate = (value: Date) =>
  useStore.setState(() => ({ pickedDate: value }));

export const setPickedReservation = (value: PickedReservationType) =>
  useStore.setState(() => ({ pickedReservation: value }));

// store + etc(localStorage, callback ...)

interface PickClinicId extends UserIdAndName {
  clinicId: number;
}
export const pickClinicId = ({ clinicId, userId, userName }: PickClinicId) => {
  setClinicId(clinicId);
  localStorageUtils.set({
    key: 'pickedClinicId',
    value: clinicId,
    userId,
    userName,
  });
};

export const toggleIsBigGlobalAside = (value: boolean) => {
  setGlobalAside(value);
  localStorageUtils.set({ key: 'isBigGlobalAside', value });
};

interface SetStorageWithBoolean {
  userId: number;
  userName: string;
  value: boolean;
}

export const toggleShowCancelOfTimetable = ({
  userId,
  userName,
  value,
}: SetStorageWithBoolean) => {
  setShowCancelOfTimetable(value);
  localStorageUtils.set({
    key: 'showCancelOfTimetable',
    userId,
    userName,
    value,
  });
};

export const toggleShowNoshowOfTimetable = ({
  userId,
  userName,
  value,
}: SetStorageWithBoolean) => {
  setShowNoshowOfTimetable(value);
  localStorageUtils.set({
    key: 'showNoshowOfTimetable',
    userId,
    userName,
    value,
  });
};

export const toggleHiddenUsers = (
  memberId: number,
  { userId, userName }: UserIdAndName
) =>
  useStore.setState((prev) => {
    const hiddenUsers = new Set(prev.hiddenUsers);
    if (hiddenUsers.has(memberId)) {
      hiddenUsers.delete(memberId);
    } else {
      hiddenUsers.add(memberId);
    }

    const clinicId = useStore.getState().pickedClinicId;
    updateLocalStorageHiddenUsers({
      hiddenUsers: [...hiddenUsers],
      clinicId,
      userId,
      userName,
    });
    return { hiddenUsers };
  });
