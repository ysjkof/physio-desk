import { useReactiveVar } from "@apollo/client";
import { faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { InDashboardPageProps } from "..";
import {
  SearchUsersByNameInput,
  useInviteClinicMutation,
  useSearchUsersByNameLazyQuery,
} from "../../../graphql/generated/graphql";
import { cls } from "../../../libs/utils";
import { selectedClinicVar } from "../../../store";
import { DashboardSectionLayout } from "../components/section-layout";

export const InviteClinic = ({ loggedInUser }: InDashboardPageProps) => {
  const {
    id: clinicId,
    name: clinicName,
    isStayed,
    isManager,
  } = useReactiveVar(selectedClinicVar);

  if (!isStayed || !isManager) {
    return <h3 className="mt-10 text-center">권한이 없습니다</h3>;
  }
  const { register, handleSubmit, getValues } = useForm<SearchUsersByNameInput>(
    { mode: "onChange" }
  );

  const [inviteClinicMutation, { loading: inviteClinicLoading }] =
    useInviteClinicMutation();

  function onClickInviteToClinic(
    user: {
      id: number;
      name: string;
      email: string;
    },
    clinicName: string,
    clinicId: number
  ) {
    if (confirm(`${clinicName}에 ${user.name}을(를) 그룹에 초대합니까?`)) {
      inviteClinicMutation({
        variables: { input: { clinicId, userIds: [user.id] } },
      });
    }
  }

  const [
    searchUsersByName,
    { data: searchUsersByNameData, loading: searchUserByNameLoading },
  ] = useSearchUsersByNameLazyQuery();

  const onSubmitSearchUsersByName = () => {
    if (!searchUserByNameLoading) {
      const { name } = getValues();
      searchUsersByName({
        variables: {
          input: { name },
        },
      });
    }
  };
  const searchUserResults = searchUsersByNameData?.searchUsersByName.results;

  return (
    <DashboardSectionLayout
      width="md"
      heightFull
      children={
        <>
          <form onSubmit={handleSubmit(onSubmitSearchUsersByName)}>
            <div className="relative flex items-center shadow-sm">
              <input
                {...register("name", {
                  required: "Username is required",
                })}
                id="search-user"
                required
                type="text"
                placeholder="사용자 검색"
                className={cls("input py-1")}
                autoComplete="off"
              />
              <label
                htmlFor="icon-search"
                className="absolute right-0 mr-4 cursor-pointer"
              >
                <input
                  id="icon-search"
                  type="submit"
                  value={""}
                  tabIndex={-1}
                  className="absolute"
                />
                <FontAwesomeIcon icon={faSearch} />
              </label>
            </div>
          </form>
          <div className="mx-auto w-full space-y-2">
            <div className="flex items-center justify-between border-b">
              <span>이름</span>
              <span>초대하기</span>
            </div>
            <ul
              className={cls(inviteClinicLoading ? "pointer-events-none" : "")}
            >
              {searchUserResults ? (
                searchUserResults.length === 0 ? (
                  <p className="py-10 text-center font-semibold">
                    검색결과가 없습니다
                  </p>
                ) : (
                  searchUserResults.map((user) => (
                    <li
                      key={user.id}
                      className="my-2 flex cursor-pointer items-center justify-between px-3 hover:bg-gray-100"
                      onClick={() =>
                        onClickInviteToClinic(user, clinicName, clinicId)
                      }
                    >
                      <span>{user.name}</span>
                      <FontAwesomeIcon icon={faUserPlus} />
                    </li>
                  ))
                )
              ) : (
                <p className="py-10 text-center font-semibold">
                  이름으로 검색해주세요
                </p>
              )}
            </ul>
          </div>
        </>
      }
    />
  );
};
