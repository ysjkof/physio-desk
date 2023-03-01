import { LOCALE } from '../../../../constants/constants';
import type { PickedPrescription } from '../../../../types/commonTypes';

interface PrescriptionTotalProps {
  selectedPrescription: PickedPrescription;
}

export const PrescriptionTotal = ({
  selectedPrescription,
}: PrescriptionTotalProps) => {
  return (
    <div className="absolute flex w-full pt-1 text-xs">
      <span className="w-full">
        총가격 : {selectedPrescription.price.toLocaleString(LOCALE)}원
      </span>
      <span className="w-full">치료시간 : {selectedPrescription.minute}분</span>
    </div>
  );
};
