import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy } from 'react';
import { useMe } from '../hooks';
import { ENDPOINT, ROUTES } from './routes';
import ProtectRoute from './ProtectRoute';
import Warning from '../_legacy_components/atoms/Warning';
import GlobalLayout from '../_legacy_components/templates/GlobalLayout';
import CreatePrescription from '../pages/dashboard/components/organisms/CreatePrescription';

const TimeTable = lazy(() => import('../pages/timetable/Timetable'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const CreateClinic = lazy(
  () => import('../pages/dashboard/components/organisms/CreateClinic')
);
const InviteClinic = lazy(
  () => import('../pages/dashboard/components/organisms/InviteClinic')
);
const Members = lazy(
  () => import('../pages/dashboard/components/organisms/Members')
);
const MyClinics = lazy(
  () => import('../pages/dashboard/components/organisms/MyClinics')
);
const PrescriptionPage = lazy(
  () => import('../pages/dashboard/components/organisms/PrescriptionPage')
);
const Statistics = lazy(
  () => import('../pages/dashboard/components/organisms/Statistics')
);
const EditProfile = lazy(
  () => import('../pages/dashboard/components/organisms/EditProfile')
);
const Search = lazy(() => import('../pages/search/Search'));

export interface LoginRouteProps {
  CommonRoute: JSX.Element[];
}
function LoginRoute({ CommonRoute }: LoginRouteProps) {
  const { data } = useMe();

  const timetableRoute = [
    {
      protectRoute: false,
      path: ENDPOINT.reserve,
      element: <TimeTable />,
    },
    {
      protectRoute: false,
      path: ENDPOINT.editReservation,
      element: <TimeTable />,
    },
    {
      protectRoute: false,
      path: ENDPOINT.createPatient,
      element: <TimeTable />,
    },
  ];
  const dashboardRoute = [
    {
      protectRoute: { protect: false, isPass: null },
      path: ENDPOINT.dashboard.clinics,
      element: <MyClinics />,
    },
    {
      protectRoute: { protect: true, isPass: data?.me.verified },
      path: ENDPOINT.dashboard.create,
      element: <CreateClinic />,
    },
    {
      protectRoute: { protect: true, isPass: data?.me.verified },
      path: ENDPOINT.dashboard.invite,
      element: <InviteClinic />,
    },
    {
      protectRoute: { protect: false, isPass: null },
      path: ENDPOINT.dashboard.member,
      element: <Members />,
    },
    {
      protectRoute: { protect: false, isPass: null },
      path: ENDPOINT.dashboard.prescription,
      element: <PrescriptionPage />,
      outlet: [
        <Route
          key="CreatePrescription"
          path="create-prescription"
          element={<CreatePrescription />}
        />,
      ],
    },
    {
      protectRoute: { protect: true, isPass: data?.me.verified },
      path: ENDPOINT.dashboard.statistics,
      element: <Statistics />,
    },
    {
      protectRoute: { protect: false, isPass: null },
      path: ENDPOINT.dashboard.editProfile,
      element: <EditProfile />,
    },
  ];

  return (
    <Routes>
      <Route path="/" element={<GlobalLayout isLoggedIn />}>
        <Route index element={<Navigate to={ROUTES.timetable} />} />,
        <Route path={ROUTES.search} element={<Search />} />
        <Route
          key="TimetableRoute"
          path={ROUTES.timetable}
          element={
            <ProtectRoute
              failElement={<Warning type="verifyEmail" />}
              isPass={data?.me.verified}
            >
              <TimeTable />
            </ProtectRoute>
          }
        >
          {timetableRoute.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route
          key="DashboardRoute"
          path={ROUTES.dashboard}
          element={<Dashboard />}
        >
          <Route index element={<Warning type="selectMenu" />} />
          {dashboardRoute.map((route) => {
            const {
              path,
              protectRoute: { protect, isPass },
              outlet,
            } = route;
            let { element } = route;

            if (protect) {
              element = (
                <ProtectRoute
                  failElement={<Warning type="verifyEmail" />}
                  isPass={!!isPass}
                >
                  {element}
                </ProtectRoute>
              );
            }

            if (outlet)
              return (
                <Route key={path} path={path} element={element}>
                  {outlet}
                </Route>
              );

            return <Route key={path} path={path} element={element} />;
          })}
        </Route>
        {CommonRoute}
      </Route>
    </Routes>
  );
}
export default LoginRoute;
