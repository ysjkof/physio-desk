type WarningType =
  | 'hasNotPermission'
  | 'hasNotStatistics'
  | 'hasNotPrescription'
  | 'emptyUserIds'
  | 'emptyData'
  | 'emptySearch'
  | 'selectMenu'
  | 'verifyEmail';

interface ChildrenProps {
  children: React.ReactNode;
  type?: false;
}
interface WarningProps {
  type: WarningType;
  children?: null;
}

export default function Worning({
  type,
  children,
}: WarningProps | ChildrenProps) {
  const messages = {
    hasNotPermission: '권한이 없습니다',
    hasNotStatistics: '통계 내역이 없습니다',
    hasNotPrescription: '처방 내역이 없습니다',
    emptyUserIds: '사용자를 선택해주세요',
    emptyData: '데이터가 없습니다',
    emptySearch: '검색결과가 없습니다',
    selectMenu: '메뉴를 선택하세요',
    verifyEmail: '이메일을 인증하면 모든 기능을 사용할 수있습니다',
  };

  return (
    <p className="my-10 mx-auto text-center text-base font-semibold">
      {type ? messages[type] : children}
    </p>
  );
}