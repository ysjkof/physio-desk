import { useMutation } from '@apollo/client';
import {
  EDIT_PRESCRIPTION_DOCUMENT,
  FIND_PRESCRIPTIONS_DOCUMENT,
} from '../graphql';
import { setToast, useStore } from '../store';
import { changeValueInArray } from '../utils/commonUtils';
import type {
  EditPrescriptionMutation,
  EditPrescriptionMutationVariables,
  FindPrescriptionsQuery,
  FindPrescriptionsQueryVariables,
} from '../types/generatedTypes';

// FormForEditPrescriptionFields의 값과 같다. EditPrescriptionInput가 InputMaybe<Scalars['String]>> 이런 타입을 쓰기 때문에 여기서 따로 선언함
interface Input {
  id: number;
  name: string;
  description?: string;
}

export const useEditPrescription = () => {
  const clinicId = useStore((state) => state.pickedClinicId);
  const variables: FindPrescriptionsQueryVariables = {
    input: { clinicId, onlyLookUpActive: false },
  };

  return useMutation<
    EditPrescriptionMutation,
    EditPrescriptionMutationVariables
  >(EDIT_PRESCRIPTION_DOCUMENT, {
    onCompleted(data, clientOptions) {
      const { error } = data.editPrescription;
      if (error) return setToast({ messages: [error] });

      const prescriptionInput: Input = clientOptions?.variables?.input;
      if (!prescriptionInput) return;

      clientOptions?.client?.cache.updateQuery<FindPrescriptionsQuery>(
        { query: FIND_PRESCRIPTIONS_DOCUMENT, variables },
        (cacheData) => {
          const cachePrescriptions = cacheData?.findPrescriptions.prescriptions;
          if (!cachePrescriptions) return cacheData;

          const index = cachePrescriptions.findIndex(
            (prescription) => prescription.id === prescriptionInput.id
          );
          if (index === -1) return cacheData;

          const updatedPrescription = {
            ...cachePrescriptions[index],
            ...prescriptionInput,
          };

          const newData = structuredClone(cacheData);
          newData.findPrescriptions.prescriptions = changeValueInArray(
            cachePrescriptions,
            updatedPrescription,
            index
          );

          return newData;
        }
      );
    },
  });
};
