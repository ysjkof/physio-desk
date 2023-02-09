import type { ReactNode } from 'react';
import type { ISchedules, UserWithEvent } from './common.types';
import { FindPrescriptionsQuery } from './generated.types';
import { FormForEditPrescriptionFields } from './form.types';

// TimeTable
export interface IUserLength {
  userLength: number;
}

export interface ILabels {
  labels: string[];
}

interface IDate {
  date: Date;
}

export interface TimetableTemplateProps {
  nav: ReactNode;
  labels: ReactNode;
  columns: ReactNode;
}

export interface SchedulesProps extends ILabels {
  weekEvents: ISchedules[];
}

export interface DateTitleProps extends IUserLength, IDate {
  isToday: boolean;
  isSelectedMonth: boolean;
}
export interface MemberNameProps extends IUserLength {
  users: UserWithEvent[];
  viewPeriodStyle: { gridTemplateColumns: string };
}

export interface ScheduleBoxProps extends MemberNameProps, ILabels, IDate {
  labelMaxLength: number;
  enableTimeIndicator: boolean;
}

// Dashboard

export type PrescriptionForFind = NonNullable<
  FlatArray<FindPrescriptionsQuery['findPrescriptions']['prescriptions'], 1>
>;

export interface CardProps {
  clinicId: number;
  prescription: PrescriptionForFind;
  showInactivate: boolean;
}

// Common

export interface CloseAction {
  closeAction: () => void;
}

export interface UseAutoCompleteProps<T> {
  firstButtonId: string;
  setInput: (value: T | null) => void;
  clearList?: () => void;
  query?: (query: string) => void;
  initialValue?: T | null;
}

export interface DatepickerProps extends Partial<CloseAction> {
  selectedDate: Date;
  selectDate: (date: Date) => void;
  disablePreviousDay?: boolean;
}

export interface FormForReservationProps extends CloseAction {
  date: Date;
  userId: number;
}

export interface FormForDayoffProps extends FormForReservationProps {}

export interface UseFormForEditPrescriptionProps {
  defaultValues: FormForEditPrescriptionFields | undefined;
}

export interface ConfirmProps extends CloseAction {
  messages: string[];
  targetName: string;
  buttonText: string;
  confirmAction: () => void;
  icon?: ReactNode;
}

export interface TogglePrescriptionActivateProps {
  id: number;
  name: string;
  activate: boolean;
}

export interface ToggleEditMode {
  toggleEditMode: () => void;
}

export interface FormForEditEmailFields {
  email: string;
}
