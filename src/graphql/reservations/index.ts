import { CREATE_DAY_OFF_DOCUMENT } from './createDayOffGql';
import { CREATE_RESERVATION_DOCUMENT } from './createReservationGql';
import { DELETE_RESERVATION_DOCUMENT } from './deleteReservationGql';
import { EDIT_RESERVATION_DOCUMENT } from './editReservationGql';
import { GET_RESERVATIONS_BY_PATIENT_DOCUMENT } from './getReservationsByPatientGql';
import { GET_STATISTICS_DOCUMENT } from './getStasticsGql';
import { LIST_RESERVATIONS_DOCUMENT } from './listReservationsGql';
import { COMMON_RESERVATION_FIELDS } from './_reservationsFragmentsGql';
import { GET_RESERVATIONS_OF_MEMBER_DOCUMENT } from './getReservationsOfMemberGql';

export {
  CREATE_DAY_OFF_DOCUMENT,
  CREATE_RESERVATION_DOCUMENT,
  DELETE_RESERVATION_DOCUMENT,
  EDIT_RESERVATION_DOCUMENT,
  GET_RESERVATIONS_BY_PATIENT_DOCUMENT,
  GET_STATISTICS_DOCUMENT,
  LIST_RESERVATIONS_DOCUMENT,
  COMMON_RESERVATION_FIELDS,
  GET_RESERVATIONS_OF_MEMBER_DOCUMENT,
};
