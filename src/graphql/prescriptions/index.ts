import { CREATE_ATOM_PRESCRIPTION_DOCUMENT } from './createAtomPrescriptionGql';
import { CREATE_PRESCRIPTION_DOCUMENT } from './createPrescriptionGql';
import { UPDATE_PRESCRIPTION_DOCUMENT } from './updatePrescriptionGql';
import { GET_ATOM_PRESCRIPTIONS_DOCUMENT } from './getAtomPrescriptionsGql';
import { GET_PRESCRIPTIONS_BY_CLINIC_DOCUMENT } from './getPrescriptionsByClinicGql';
import {
  ALL_PRESCRIPTION_FIELDS,
  COMMON_PRESCRIPTION_FIELDS,
} from './_prescriptionsFragmentsGql';
import { GET_PRESCRIPTION_BY_ID_DOCUMENT } from './getPrescriptionByIdGql';

export {
  CREATE_ATOM_PRESCRIPTION_DOCUMENT,
  CREATE_PRESCRIPTION_DOCUMENT,
  UPDATE_PRESCRIPTION_DOCUMENT,
  GET_ATOM_PRESCRIPTIONS_DOCUMENT,
  GET_PRESCRIPTIONS_BY_CLINIC_DOCUMENT,
  ALL_PRESCRIPTION_FIELDS,
  COMMON_PRESCRIPTION_FIELDS,
  GET_PRESCRIPTION_BY_ID_DOCUMENT,
};
