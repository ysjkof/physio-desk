import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { addDays, startOfDay } from 'date-fns';
import { TABLE_TIME_GAP, isProduction } from './constants/constants';
import {
  localStorageUtils,
  updateLocalStorageHiddenUsers,
} from './utils/localStorageUtils';
import type {
  TableTimeOptions,
  PickedReservationType,
  UserIdAndName,
} from './types/commonTypes';
import type { HiddenUsersArr, HiddenUsersSet } from './types/storeTypes';
import type {
  AlertType,
  ConfirmStateType,
  ToastType,
} from './types/propsTypes';

interface ZustandStoreState {
  user: UserIdAndName;
  isLoggedIn: boolean;
  pickedClinicId: number;
  toast: ToastType;
  alert: AlertType;
  confirm: ConfirmStateType;
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
  isCopyMode: boolean;
}

const initialState: ZustandStoreState = {
  user: { id: 0, name: '' },
  isLoggedIn: false,
  pickedClinicId: 0,
  toast: undefined,
  alert: undefined,
  confirm: undefined,
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
  pickedDate: startOfDay(new Date()),
  pickedReservation: undefined,
  isCopyMode: false,
};

export const useStore = !isProduction
  ? create<ZustandStoreState>()(devtools(() => initialState))
  : create<ZustandStoreState>(() => initialState);

// 전역

export const setUser = (user: UserIdAndName) =>
  useStore.setState(() => ({ user }));

export const setAuthToken = (_token?: string) =>
  useStore.setState(() => {
    let token: string | null | undefined = _token;
    if (!_token) {
      token = localStorageUtils.get({ key: 'token' });
    }
    return { isLoggedIn: !!token };
  });

export const setPickedClinicId = (clinicId: number) =>
  useStore.setState(() => ({ pickedClinicId: clinicId }));

export const setToast = (props: ToastType) =>
  useStore.setState(() => ({ toast: props }));

export const setAlert = (props: AlertType) =>
  useStore.setState(() => ({ alert: props }));

export const setConfirm = (props: ConfirmStateType) =>
  useStore.setState(() => ({ confirm: props }));

export const setGlobalAside = (value?: boolean) =>
  useStore.setState((state) => ({
    isBigGlobalAside:
      typeof value === 'undefined' ? !state.isBigGlobalAside : value,
  }));

export const resetStore = () => useStore.setState(() => initialState);

// 시간표

export const setIsWeekCalendar = (value?: boolean) =>
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

export const setPickedDate = (value?: Date, calcBy?: number) =>
  useStore.setState((prev) => {
    const date = value || prev.pickedDate;
    if (calcBy) {
      if (calcBy > 0) return { pickedDate: addDays(date, calcBy) };
      if (calcBy < 0) return { pickedDate: addDays(date, calcBy) };
    }
    return { pickedDate: date };
  });

export const setPickedReservation = (value: PickedReservationType) =>
  useStore.setState(() => ({ pickedReservation: value }));

export const setIsCopyMode = (value: boolean) =>
  useStore.setState(() => ({ isCopyMode: value }));

// store + etc(localStorage, callback ...)

export const resetStoreAndLocalStorage = (user: UserIdAndName) => {
  resetStore();
  localStorageUtils.removeAll(user);
};

export const pickClinicId = (clinicId: number) => {
  const { user } = useStore.getState();
  setPickedClinicId(clinicId);
  localStorageUtils.set({
    key: 'pickedClinicId',
    value: clinicId,
    ...user,
  });
};

export const toggleIsBigGlobalAside = (value: boolean) => {
  setGlobalAside(value);
  localStorageUtils.set({ key: 'isBigGlobalAside', value });
};

export const toggleIsWeekCalendar = (value: boolean) => {
  setIsWeekCalendar(value);
  localStorageUtils.set({ key: 'isWeekCalendar', value });
};

export const toggleShowCancelOfTimetable = (
  user: UserIdAndName,
  value: boolean
) => {
  setShowCancelOfTimetable(value);
  localStorageUtils.set({
    key: 'showCancelOfTimetable',
    ...user,
    value,
  });
};

export const toggleShowNoshowOfTimetable = (
  user: UserIdAndName,
  value: boolean
) => {
  setShowNoshowOfTimetable(value);
  localStorageUtils.set({
    key: 'showNoshowOfTimetable',
    ...user,
    value,
  });
};

export const toggleHiddenUsers = (memberId: number, maxMember: number) =>
  useStore.setState((prev) => {
    const hiddenUsers = new Set(prev.hiddenUsers);
    if (hiddenUsers.has(memberId)) {
      hiddenUsers.delete(memberId);
    } else if (maxMember - 1 !== hiddenUsers.size) hiddenUsers.add(memberId);

    const clinicId = useStore.getState().pickedClinicId;
    const { user } = useStore.getState();

    updateLocalStorageHiddenUsers([...hiddenUsers], clinicId, user);
    return { hiddenUsers };
  });
