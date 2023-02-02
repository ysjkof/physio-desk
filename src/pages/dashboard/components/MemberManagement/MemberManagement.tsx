import { Outlet } from 'react-router-dom';
import { MemberList, SearchAndInviteMember } from './components';

const MemberManagement = () => {
  return (
    <>
      <div className="css_dashboard__member-management-column__1st">
        <h1 className="mb-8 pl-4 text-3xl font-medium">직원열람 및 관리</h1>
        <SearchAndInviteMember />
        <MemberList />
      </div>
      <div
        className="css_dashboard__member-management-column__2nd"
        style={{ width: 'calc(100% - 560px)' }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default MemberManagement;
