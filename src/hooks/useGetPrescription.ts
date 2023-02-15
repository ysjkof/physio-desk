import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PRESCRIPTIONS_DOCUMENT } from '../graphql/prescriptions/getPrescriptionsGql';
import type {
  GetPrescriptionsQuery,
  GetPrescriptionsQueryVariables,
} from '../types/generatedTypes';
import { useStore } from '../store';

export const useGetPrescription = () => {
  const clinicId = useStore((state) => state.pickedClinicId);

  const { prescriptionId } = useParams();

  if (!prescriptionId) throw new Error();

  return useQuery<GetPrescriptionsQuery, GetPrescriptionsQueryVariables>(
    GET_PRESCRIPTIONS_DOCUMENT,
    {
      variables: {
        input: {
          clinicId,
          prescriptionIds: [+prescriptionId],
          onlyLookUpActive: false,
        },
      },
    }
  );
};
