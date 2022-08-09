import { useReactiveVar } from '@apollo/client';
import {
  clinicListsVar,
  queryResultVar,
  selectedInfoVar,
  todayNowVar,
  viewOptionsVar,
} from '../store';
import { SetSelectedInfoKey, SetSelectedInfoValue } from '../types/type';
import { useMe } from './useMe';

export default function useStore() {
  const { data } = useMe();
  const queryResult = useReactiveVar(queryResultVar);
  const today = useReactiveVar(todayNowVar);
  const viewOptions = useReactiveVar(viewOptionsVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const selectedInfo = useReactiveVar(selectedInfoVar);

  const createStorageKey = (key: string) => {
    if (!data?.me) throw new Error('데이터가 없어 로그인 유저');
    return key + data?.me.id;
  };
  const setLocalStorage = (storageKey: string, value: any) => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  };

  const setSelectedInfo = (
    key: SetSelectedInfoKey,
    value: SetSelectedInfoValue
  ) => {
    if (selectedInfo[key] === value) return;
    selectedInfoVar({ ...selectedInfo, [key]: value });
    if (key === 'date') return;
    setLocalStorage(createStorageKey(key), value);
  };

  return {
    setSelectedInfo,
    queryResult,
    today,
    viewOptions,
    clinicLists,
    selectedInfo,
  };
}
