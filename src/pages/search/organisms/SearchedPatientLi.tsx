import { getYMD } from '../../../services/dateServices';
import { cls } from '../../../utils/utils';

interface SearchedPatientLiProps {
  id: number;
  gender: string;
  name: string;
  registrationNumber: number | null | undefined;
  birthday: Date;
  columnCount?: 2 | 3 | 4;
}

export default function SearchedPatientLi({
  id,
  gender,
  name,
  registrationNumber,
  birthday,
  columnCount = 4,
}: SearchedPatientLiProps) {
  const seeDetail = () => {};
  const seeReservations = () => {};
  return (
    <div
      className={cls(
        'grid w-full grid-cols-5 items-center text-center ',
        columnCount <= 3 ? '' : 'py-2'
      )}
    >
      {columnCount === 2 && !registrationNumber ? (
        <span className="">{getYMD(birthday, 'yymmdd', '-')}</span>
      ) : (
        <span
          className={cls(registrationNumber ? 'text-right' : 'text-center', '')}
        >
          {registrationNumber ? registrationNumber : '-'}
        </span>
      )}
      <span
        className={cls(
          columnCount <= 3 ? 'col-span-2 ml-5 flex' : '',
          columnCount === 2 ? 'col-span-3 pl-1.5' : ''
        )}
      >
        {columnCount === 2 && name.length > 5
          ? `${name.substring(0, 4)}..`
          : name}
      </span>

      <div
        className={cls(
          'flex items-center',
          columnCount <= 3
            ? 'col-span-2 flex-row justify-end space-x-2'
            : 'flex-col',
          columnCount === 2 ? 'col-span-1' : ''
        )}
      >
        <span
          className={cls(gender === 'male' ? 'text-blue-500' : 'text-red-400')}
        >
          {gender === 'male' ? '남성' : '여성'}
        </span>
        {columnCount === 2 ? (
          ''
        ) : (
          <span className="">{getYMD(birthday, 'yymmdd', '-')}</span>
        )}
      </div>
      {columnCount <= 3 ? (
        ''
      ) : (
        <>
          <div onClick={seeDetail}>
            <button className="rounded-full bg-gray-50 px-3 font-medium ">
              자세히
            </button>
          </div>
          <div onClick={seeReservations}>
            <button className="rounded-full bg-blue-50 px-3 font-medium text-blue-400">
              예약
            </button>
          </div>
        </>
      )}
    </div>
  );
}
