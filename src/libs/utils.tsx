import { ModifiedClinic } from "../pages/dashboard";
import {
  clinicListsVar,
  IViewOption,
  selectedClinicVar,
  viewOptionsVar,
} from "../store";
import {
  LOCALSTORAGE_SELECTED_CLINIC,
  LOCALSTORAGE_CLINIC_LISTS,
  LOCALSTORAGE_VIEW_OPTION,
} from "../variables";
import { ClinicWithOptions } from "./timetable-utils";

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function getDateFromYMDHM(
  startDateYear: number,
  startDateMonth: number,
  startDateDate: number,
  startDateHours?: number,
  startDateMinutes?: number
) {
  const MM = String(startDateMonth).padStart(2, "0");
  const DD = String(startDateDate).padStart(2, "0");
  const ymd = `${startDateYear}-${MM}-${DD}`;
  let hms = `T00:00:00.000`;
  if (
    typeof startDateHours === "number" &&
    typeof startDateMinutes === "number"
  ) {
    const HH = String(startDateHours).padStart(2, "0");
    const MM = String(startDateMinutes).padStart(2, "0");
    hms = `T${HH}:${MM}:00.000`;
  }
  return new Date(ymd + hms);
}

export function getPositionRef(
  ref: React.RefObject<HTMLDivElement>,
  modalGap: number
): [top: number, left: number] {
  const height = ref.current?.getBoundingClientRect().height ?? 0;
  const top =
    ref.current?.getBoundingClientRect().top! + height + modalGap ?? 0;
  const left = ref.current?.getBoundingClientRect().left ?? 0;
  return [top, left];
}

export function saveSelectedClinic(
  newSelectedClinic: ModifiedClinic,
  loggedInUserId: number
) {
  localStorage.setItem(
    LOCALSTORAGE_SELECTED_CLINIC + loggedInUserId,
    JSON.stringify(newSelectedClinic)
  );
  selectedClinicVar(newSelectedClinic);
}
export function saveClinicLists(
  newClinicList: ClinicWithOptions[],
  loggedInUserId: number
) {
  localStorage.setItem(
    LOCALSTORAGE_CLINIC_LISTS + loggedInUserId,
    JSON.stringify(newClinicList)
  );
  clinicListsVar(newClinicList);
}
export function saveViewOptions(
  newViewOptions: IViewOption,
  loggedInUserId: number
) {
  localStorage.setItem(
    LOCALSTORAGE_VIEW_OPTION + loggedInUserId,
    JSON.stringify(newViewOptions)
  );
  viewOptionsVar(newViewOptions);
}

export function checkMember(staying: boolean, accepted: boolean) {
  if (!staying) {
    return accepted ? "탈퇴" : "수락대기";
  } else {
    return accepted ? "직원" : null;
  }
  // if (staying && accepted) return "직원";
  // if (!staying && !accepted) return "수락대기";
  // if (!staying && accepted) return "탈퇴";
}
