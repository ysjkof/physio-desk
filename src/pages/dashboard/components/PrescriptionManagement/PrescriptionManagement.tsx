import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrescriptionManagementController from './PrescriptionManagementController';
import PrescriptionTableHeader from './PrescriptionTableHeader';
import PrescriptionItem from './PrescriptionItem';
import { CreatePrescription } from '../CreatePrescription';
import EditPrescription from '../EditPrescription/EditPrescription';
import { useStore } from '../../../../store';
import { useGetPrescriptions, useWindowSize } from '../../../../hooks';
import { ProtectStayMember, Warning } from '../../../../components';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../../../../constants/constants';

const PrescriptionManagement = () => {
  const { height } = useWindowSize(true);
  const [seeInactivation, setSeeInactivation] = useState(false);

  const clinicId = useStore((state) => state.pickedClinicId);

  const [queryData] = useGetPrescriptions();

  const { pathname } = useLocation();
  const hasCreate = pathname.endsWith('/create');
  const hasEdit = pathname.endsWith('/edit');

  const navigate = useNavigate();
  const closeAction = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet title={`처방관리 | ${SERVICE_NAME.ko}`} />

      <ProtectStayMember
        clinicId={clinicId}
        fallback={<Warning type="hasNotPermission" />}
      >
        <div
          className="grow whitespace-nowrap bg-[#F9F9FF] px-10"
          style={{ height }}
        >
          <div className="my-6 flex items-center justify-between gap-6">
            <div className="flex items-baseline gap-2">
              <h1 className="dashboard-menu-title">처방목록</h1>
              <span className="text-[#8D8DAD]">
                {queryData?.count || 0}/{queryData?.maximumCount || 10}
              </span>
            </div>
            <PrescriptionManagementController
              seeInactivation={seeInactivation}
              setSeeInactivation={setSeeInactivation}
            />
          </div>

          <PrescriptionTableHeader />
          <div
            className="prescription-management__table-body pb-20"
            style={{ height: 'calc(100% - 92px)' }}
          >
            {queryData?.prescriptions?.map((prescription) => (
              <PrescriptionItem
                key={prescription.id}
                prescription={prescription}
                clinicId={clinicId}
                seeInactivation={seeInactivation}
              />
            ))}
          </div>

          {hasCreate && <CreatePrescription closeAction={closeAction} />}
          {hasEdit && <EditPrescription closeAction={closeAction} />}
        </div>
      </ProtectStayMember>
    </>
  );
};

export default PrescriptionManagement;
