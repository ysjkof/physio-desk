import { useMutation } from '@apollo/client';
import {
  FIND_MY_CLINICS_DOCUMENT,
  REFUSE_INVITATION_DOCUMENT,
} from '../graphql';
import { toastVar } from '../store';
import { client } from '../apollo';
import type {
  RefuseInvitationMutation,
  RefuseInvitationMutationVariables,
} from '../types/generated.types';

export const useRefuseInvitation = ({ memberId }: { memberId: number }) => {
  const [cancelInvitationMutation] = useMutation<
    RefuseInvitationMutation,
    RefuseInvitationMutationVariables
  >(REFUSE_INVITATION_DOCUMENT);

  const refuseInvitation = () => {
    cancelInvitationMutation({
      variables: { input: { memberId } },
      onCompleted(data) {
        if (data.refuseInvitation.error)
          return toastVar({
            messages: ['초대 거절 중에 에러 발생', data.refuseInvitation.error],
          });

        // TODO: 캐시 업데이트
        if (data.refuseInvitation.ok) {
          alert('삭제 완료');
          client.refetchQueries({ include: [FIND_MY_CLINICS_DOCUMENT] });
          return;
        }
        alert('삭제 실패');
      },
    });
  };

  return { refuseInvitation };
};
