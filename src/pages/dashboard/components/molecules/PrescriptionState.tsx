import { client } from '../../../../apollo';
import {
  FindPrescriptionsDocument,
  FindPrescriptionsQuery,
  useEditPrescriptionMutation,
} from '../../../../graphql/generated/graphql';
import { toastVar } from '../../../../store';
import { changeValueInArray, cls } from '../../../../utils/utils';
import { CardProps } from './PrescriptionCard';

interface PrescriptionStateProps extends Pick<CardProps, 'clinicId'> {
  id: number;
  activate: boolean;
}

export default function PrescriptionState({
  id,
  activate,
  clinicId,
}: PrescriptionStateProps) {
  const [callMutation] = useEditPrescriptionMutation();

  const toggleActivation = () => {
    const todo = activate ? '비활성' : '활성';
    if (!confirm(`처방을 ${todo} 하시겠습니까?`)) return;

    const inputActivate = !activate;

    callMutation({
      variables: {
        input: {
          id,
          activate: inputActivate,
        },
      },
      onCompleted(data) {
        const { error } = data.editPrescription;
        if (error) return toastVar({ messages: [error] });

        client.cache.updateQuery<FindPrescriptionsQuery>(
          {
            query: FindPrescriptionsDocument,
            variables: {
              input: {
                clinicId,
                onlyLookUpActive: false,
              },
            },
          },
          (cacheData) => {
            if (
              !cacheData ||
              !cacheData.findPrescriptions ||
              !cacheData.findPrescriptions.prescriptions
            )
              return cacheData;

            const index = cacheData.findPrescriptions.prescriptions.findIndex(
              (prescription) => prescription.id === id
            );
            if (index === -1) return cacheData;
            const changePrescription = {
              ...cacheData.findPrescriptions.prescriptions[index],
              activate: inputActivate,
            };

            return {
              ...cacheData,
              findPrescriptions: {
                ...cacheData.findPrescriptions,
                prescriptions: changeValueInArray(
                  cacheData.findPrescriptions.prescriptions,
                  changePrescription,
                  index
                ),
              },
            };
          }
        );
      },
    });
  };

  return (
    <button
      type="button"
      className={cls(
        'whitespace-nowrap rounded-full',
        activate ? 'badge-green' : 'badge-gray line-through'
      )}
      onClick={toggleActivation}
    >
      활성
    </button>
  );
}