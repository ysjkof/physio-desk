import { useReactiveVar } from '@apollo/client';
import useCancelInvitation from '../../hooks/useCancelInvitation';
import { ClinicsOfClient } from '../../../../models';
import { clinicListsVar, loggedInUserVar } from '../../../../store';
import { checkManager, getMemberState } from '../../../../utils/utils';
import UserCard from '../molecules/UserCard';

export default function Members() {
  useReactiveVar(clinicListsVar); // ui 새로고침 용
  const loggedInUser = loggedInUserVar();

  const { invokeCancelInvitation, loading: loadingCancel } =
    useCancelInvitation();

  const isManager = checkManager(
    ClinicsOfClient.selectedClinic?.members,
    loggedInUser!.id
  );

  return (
    <section className="px-10 py-8">
      <UserCard.Container>
        {ClinicsOfClient.selectedClinic?.members.map((member) => {
          const state = getMemberState(
            member.staying,
            member.accepted,
            member.manager
          );
          return (
            <UserCard
              key={member.user.id}
              name={member.user.name}
              state={state}
              button={
                state === '승인대기' &&
                isManager && (
                  <UserCard.Button
                    type="button"
                    loading={loadingCancel}
                    onClick={() => invokeCancelInvitation(member.id, true)}
                  >
                    <div className="mr-2 h-5 w-5 bg-no" />
                    초대취소
                  </UserCard.Button>
                )
              }
            />
          );
        })}
      </UserCard.Container>
    </section>
  );
}
