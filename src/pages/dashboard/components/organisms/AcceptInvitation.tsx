import Warning from '../../../../_legacy_components/atoms/Warning';
import Button from '../../../../_legacy_components/molecules/Button';
import { useAcceptInvitation, useCancelInvitation } from '../../hooks';

export default function AcceptInvitation() {
  const { acceptInvitation, clinicName, selectedClinicId, loading, memberId } =
    useAcceptInvitation();

  const { invokeCancelInvitation, loading: loadingCancel } =
    useCancelInvitation();

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Warning>
        {clinicName}에 초대됐습니다. 초대 수락을 하면 병원의 기능을 사용할 수
        있습니다.
      </Warning>
      <div className="flex gap-4">
        <Button
          type="button"
          canClick={!loading}
          loading={loading}
          onClick={() => acceptInvitation(selectedClinicId)}
        >
          초대 수락
        </Button>
        <Button
          type="button"
          canClick={!loadingCancel}
          loading={loadingCancel}
          onClick={() => invokeCancelInvitation(memberId!)}
        >
          거절
        </Button>
      </div>
    </div>
  );
}
