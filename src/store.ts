import { makeVar } from "@apollo/client";
import { ListReservationsQuery, Patient } from "./graphql/generated/graphql";
import { ClinicWithOptions } from "./libs/timetable-utils";
import { ONE_DAY, ONE_WEEK } from "./variables";

// 이곳에서 전역 변수 관리

export const queryResultVar = makeVar<ListReservationsQuery | undefined>(
  undefined
);

export interface SelectedPatient
  extends Pick<Patient, "name" | "gender" | "registrationNumber" | "birthday"> {
  id: number;
  clinicName: string;
  user?: { id: number; name: string };
}

export const selectedPatientVar = makeVar<null | SelectedPatient>(null);

export const todayNowVar = makeVar<Date>(new Date());

export const clinicListsVar = makeVar<ClinicWithOptions[]>([]); // member의 activated key를 저장하기 위해서 필요함.

export interface IViewOption {
  periodToView: typeof ONE_DAY | typeof ONE_WEEK;
  seeCancel: boolean;
  seeNoshow: boolean;
  seeList: boolean;
  seeActiveOption: boolean;
  navigationExpand: boolean;
}
export const defaultViewOptions: IViewOption = {
  periodToView: ONE_WEEK,
  seeCancel: true,
  seeNoshow: true,
  seeList: false,
  seeActiveOption: false,
  navigationExpand: false,
};

export const viewOptionsVar = makeVar(defaultViewOptions);

export const selectedClinic = {
  id: 0,
  name: "",
};

export const selectedClinicVar = makeVar(selectedClinic);
