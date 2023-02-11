import { toastVar } from '../store';
import { MemberStatus } from '../types/common.types';
import { ReservationState } from '../types/generated.types';

export function cls(...classnames: string[]) {
  return classnames.join(' ');
}

export function getPositionRef(
  ref: React.RefObject<HTMLDivElement | HTMLButtonElement>,
  modalGap?: number
) {
  if (!ref.current) return { top: 0, left: 0 };
  const {
    height,
    left,
    right,
    width,
    top: refTop,
  } = ref.current.getBoundingClientRect();

  const top = refTop + height + (modalGap || 0);
  return { top, width, left, right };
}

export function getStringFromReservationState(
  state: keyof typeof ReservationState
) {
  const korWord = {
    Canceled: '취소',
    DayOff: '휴가',
    NoShow: '부도',
    Reserved: '예약',
  };
  return korWord[state];
}

export function getMemberState({
  staying,
  accepted,
  manager,
}: MemberStatus): '관리자' | '직원' | '탈퇴' | '승인대기' {
  if (staying && accepted) {
    return manager ? '관리자' : '직원';
  }
  if (!staying && accepted) return '탈퇴';
  if (!staying && !accepted) return '승인대기';
  throw new Error('getMemberState >> 불가능한 경우의 수');
}

export type StayingState = ReturnType<typeof getMemberState>;

export function isStayMember(state: StayingState) {
  const memberState = {
    승인대기: false,
    관리자: true,
    직원: true,
    탈퇴: false,
  };
  return memberState[state];
}

interface CheckManager {
  id: number;
  manager: boolean;
  user: { id: number };
}

export function checkManager(members: CheckManager[], userId: number) {
  const managerId = members.find((member) => member.manager)?.user.id;
  return !!(managerId && managerId === userId);
}

export function makeArrFromLength(length: number) {
  const arr: number[] = [];
  arr.length = length;
  arr.fill(0);
  return arr;
}

export function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export function removeItemInArrayByIndex(index: number, array: unknown[]) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function changeValueInArray<T>(array: T[], value: T, index: number) {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

export function renameUseSplit(name: string) {
  const isSplit = removePersonalClinicNumber(name);
  return isSplit ? `전용 : ${isSplit}` : name;
}

function removePersonalClinicNumber(name: string) {
  const splinted = name.split(':');
  return splinted.length < 2 ? null : splinted[0];
}

export function addPrefixToNameWhenWaiting(name: string, isAccepted?: boolean) {
  let prefix = '';
  if (!isAccepted) {
    prefix = '수락대기 : ';
  }
  return prefix + renameUseSplit(name);
}

/** ok, error만 있는 GraphQL 응답을 받고 토스트 출력이나 콜백 실행 */
export function simpleCheckGQLError(
  ok: boolean,
  error?: string | null,
  callback?: () => void
) {
  if (error) {
    toastVar({ messages: [`오류가 발생했습니다; ${error}`] });
  }
  if (callback && ok) callback();
}

// FIXME: checkLengthIsZero로 대체. 지울 것.
export function checkArrayIncludeValue<T>(arr: T[] | undefined | null) {
  if (!arr) return false;
  return arr.length >= 1 ? arr : false;
}

export function createArrayFromLength(length: number) {
  const numbers = [1];
  while (numbers.length < length) {
    numbers.push(numbers.length + 1);
  }
  return numbers;
}

export function checkLengthIsZero<T>(arr?: T | null) {
  if (!Array.isArray(arr)) return undefined;
  return arr?.length === 0 ? undefined : arr;
}

export function sortByString(
  str1: string,
  str2: string,
  direction: 'ASC' | 'DESC'
) {
  if (!direction || direction === 'ASC') {
    if (str1 > str2) return 1;
    if (str1 < str2) return -1;
    return 0;
  }
  if (str1 > str2) return -1;
  if (str1 < str2) return 1;
  return 0;
}

export function sortByBoolean(
  bool1: boolean,
  bool2: boolean,
  direction: 'ASC' | 'DESC'
) {
  if (!direction || direction === 'ASC') {
    if (bool1 > bool2) return 1;
    if (bool1 < bool2) return -1;
    return 0;
  }
  if (bool1 > bool2) return -1;
  if (bool1 < bool2) return 1;
  return 0;
}
