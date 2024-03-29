import { UseFormRegister } from 'react-hook-form';
import {
  getMemberState,
  isMembersWaiting,
  renameUseSplit,
} from '../../../../utils/commonUtils';
import { Checkbox } from '../../../../components';
import { useGetMyMembers } from '../../../../hooks';
import { useStore } from '../../../../store';

export const SearchCheckList = ({
  register,
}: {
  register: UseFormRegister<{
    clinicIds: number[];
  }>;
}) => {
  const clinicId = useStore((state) => state.pickedClinicId);

  const [myMembers] = useGetMyMembers();

  const memberWithoutWaiting = myMembers?.filter(
    ({ accepted, staying }) =>
      !isMembersWaiting(getMemberState({ accepted, staying }))
  );

  return (
    <div className="flex flex-wrap gap-6 border-b px-6 py-2">
      {memberWithoutWaiting?.map((member) => (
        <Checkbox
          key={member.clinic.id}
          id={`search__clinic-${member.clinic.id}`}
          label={renameUseSplit(member.clinic.name)}
          type="checkbox"
          value={member.clinic.id}
          register={register('clinicIds', {
            required: true,
          })}
          defaultChecked={member.clinic.id === clinicId}
        />
      ))}
    </div>
  );
};
