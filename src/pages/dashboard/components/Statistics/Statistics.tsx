import Chart from './Chart';

const Statistics = () => {
  return (
    <div className="grow whitespace-nowrap bg-[#F9F9FF] p-10">
      <StatisticsHeader />
      <DateSelector />
      <UserSelector />
      <Chart />
    </div>
  );
};

const StatisticsHeader = () => {
  return (
    <div className="mb-8 flex items-center justify-between gap-6">
      <h1 className="text-2xl font-semibold text-[#262850]">예약통계</h1>
      <div />
    </div>
  );
};

const DateSelector = () => {
  return <div className="flex items-center">날짜 선택기</div>;
};
const UserSelector = () => {
  return <div className="flex items-center">치료사 선택기</div>;
};

export default Statistics;
