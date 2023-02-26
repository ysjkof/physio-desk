import { ChangeEvent, useState } from 'react';
import TableChartCard from './TableChartCard';
import { useDebouncedCallback } from '../../../../../hooks';
import { SearchInput } from '../../../../../components';
import type { TableChartProps } from '../../../../../types/propsTypes';

const TableChart = ({ countList }: TableChartProps) => {
  const [query, setQuery] = useState('');

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuery(value);
  };
  const debounceQuery = useDebouncedCallback(handleInput);

  return (
    <div className="table-chart w-[270px] gap-4">
      <SearchInput
        id="table-chart__search-patient"
        name="table-chart__search-patient"
        placeholder="치료사 검색"
        onChange={debounceQuery}
      />
      <div className="flex w-fit flex-col gap-2 overflow-y-scroll">
        {countList &&
          Object.entries(countList).map(([key, value]) => {
            return (
              <TableChartCard key={key} userId={key} {...value} query={query} />
            );
          })}
        {countList &&
          Object.entries(countList).map(([key, value]) => {
            return (
              <TableChartCard key={key} userId={key} {...value} query={query} />
            );
          })}
        {countList &&
          Object.entries(countList).map(([key, value]) => {
            return (
              <TableChartCard key={key} userId={key} {...value} query={query} />
            );
          })}
      </div>
    </div>
  );
};

export default TableChart;
