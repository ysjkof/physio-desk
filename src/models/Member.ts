import { getMemberState, isMemberActive } from '../utils/commonUtils';
import type { MemberOfGetReservationsByInterval } from '../types/processedGeneratedTypes';

export class Member {
  #member;
  constructor(member: MemberOfGetReservationsByInterval) {
    this.#member = member;
  }

  getName() {
    return this.#member.user.name;
  }

  getFormattedNameWithStateIfWithdrawn() {
    const state = this.getState();
    if (state === '탈퇴') return `${this.getName()} (${state})`;
    return this.getName();
  }

  isMemberActive() {
    const state = this.getState();
    return isMemberActive(state);
  }

  getState() {
    const { accepted, manager, staying } = this.#member;
    return getMemberState({ accepted, manager, staying });
  }

  getColor() {
    return this.#member.color?.value;
  }
}
