import { useReactiveVar } from "@apollo/client";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faCalendarAlt,
  faList,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Group,
  ListReservationsQuery,
  MeQuery,
  Patient,
  Reservation,
  ReservationState,
  User,
} from "../graphql/generated/graphql";
import {
  compareDateMatch,
  compareNumAfterGetMinutes,
  compareSameWeek,
  getSunday,
  getTimeGaps,
  getWeeks,
  getWeeksOfMonth,
  DayWithUsers,
  injectUsers,
  spreadGroupMembers,
} from "../libs/timetable-utils";
import { cls, getHHMM, getTimeLength } from "../libs/utils";
import {
  LOCALSTORAGE_VIEW_OPTION,
  LOCALSTORAGE_VIEW_OPTION_GROUPS,
} from "../libs/variables";
import { ReservationDetail } from "../pages/reservation-detail";
import { GroupMemberWithOptions, GroupWithOptions } from "../pages/test";
import { colorsObj, groupListsVar, todayVar, viewOptionsVar } from "../store";
import { BtnArrow } from "./button-arrow";
import { BtnDatecheck } from "./button-datecheck";
import { ModalPortal } from "./modal-portal";
import { MoveXBtn } from "./move-x-btn";
import { Reserve2 } from "./reserve";
import { Switch } from "./switch";
import { TimeIndicatorBar } from "./time-indicator-bar";

interface ITimeOption {
  start: { hours: number; minutes: number };
  end: { hours: number; minutes: number };
}
type IONE_DAY = 1;
type IONE_WEEK = 7;
const ONE_DAY = 1;
const ONE_WEEK = 7;

export interface IViewOption {
  periodToView: IONE_DAY | IONE_WEEK;
  seeCancel: boolean;
  seeNoshow: boolean;
  seeList: boolean;
  seeActiveOption: boolean;
  navigationExpand: boolean;
}
interface ITimetableProps {
  tableTime: ITimeOption;
  eventsData?: ListReservationsQuery;
  selectedDateState: {
    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  };
  loginUser: MeQuery;
}
export interface ModifiedReservation
  extends Pick<Reservation, "id" | "startDate" | "endDate" | "state" | "memo"> {
  therapist: Pick<User, "id" | "name">;
  lastModifier: Pick<User, "id" | "name" | "email">;
  patient: Pick<
    Patient,
    "id" | "name" | "gender" | "registrationNumber" | "birthday"
  >;
  group?: Pick<Group, "id" | "name"> | null;
}

export const Timetable: React.FC<ITimetableProps> = ({
  tableTime,
  eventsData,
  selectedDateState: { selectedDate, setSelectedDate },
  loginUser,
}) => {
  const today = useReactiveVar(todayVar);
  const [weekEvents, setWeekEvents] = useState<DayWithUsers[]>([]);
  const [aDay, setADay] = useState<Date>(today);
  const [weeks, setWeeks] = useState<{ date: Date }[]>(
    getWeeks(getSunday(today))
  );
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(today);
  const [daysOfMonth, setDaysOfMonth] = useState<{ date: Date }[]>(
    getWeeksOfMonth(today)
  );

  const labels = getTimeGaps(
    tableTime.start.hours,
    tableTime.start.minutes,
    tableTime.end.hours,
    tableTime.end.minutes,
    10
  );
  const groupLists = useReactiveVar(groupListsVar);
  const viewOptions = useReactiveVar(viewOptionsVar);

  const handleDateNavMovePrev = () => {
    const date = new Date(selectedDate);
    viewOptions?.navigationExpand
      ? date.setMonth(date.getMonth() - 1)
      : date.setDate(date.getDate() - 7);
    setSelectedDate(date);
  };
  const handleDateNavMoveNext = () => {
    const date = new Date(selectedDate);
    viewOptions?.navigationExpand
      ? date.setMonth(date.getMonth() + 1)
      : date.setDate(date.getDate() + 7);
    setSelectedDate(date);
  };
  const [openEventModal, setOpenEventModal] = useState<boolean>(false);
  const [eventIdForModal, setEventIdForModal] = useState<number | null>(null);
  const onClickEventBox = (eventId: number) => {
    setEventIdForModal(eventId);
    setOpenEventModal(true);
  };
  const [openReserveModal, setOpenReserveModal] = useState<boolean>(false);
  const [eventStartDate, setEventStartDate] = useState<Date>();
  const onClickRserve = (date: Date, label: Date) => {
    const processedDate = new Date(date);
    processedDate.setHours(label.getHours(), label.getMinutes());
    setEventStartDate(processedDate);
    setOpenReserveModal(true);
  };

  function distributor(
    events: ModifiedReservation[] | undefined | null,
    members: GroupMemberWithOptions[]
  ) {
    let days = injectUsers(
      getWeeks(getSunday(selectedDate)),
      loginUser,
      members
    );
    events?.forEach((event) => {
      const dateIndex = days.findIndex((day) =>
        compareDateMatch(day.date, new Date(event.startDate), "ymd")
      );
      if (dateIndex !== -1) {
        const userIndex = days[dateIndex].users.findIndex(
          (member) => member.user.id === event.therapist.id
        );
        if (userIndex !== -1) {
          days[dateIndex].users[userIndex].events.push(event);
        }
      }
    });
    return days;
  }

  useEffect(() => {
    if (eventsData?.listReservations.ok) {
      const distributeEvents = distributor(
        eventsData.listReservations.results,
        spreadGroupMembers(groupLists)
      );
      setWeekEvents(distributeEvents);
    }
    // setGroupLists(groupList);
    // }, [eventsData, groupList, groupLists]);
  }, [eventsData, groupLists]);

  useEffect(() => {
    if (!compareDateMatch(selectedDate, prevSelectedDate, "ym")) {
      console.log("년월이 다르다");
      setWeeks(getWeeks(getSunday(selectedDate)));
      setDaysOfMonth(getWeeksOfMonth(selectedDate));
    } else if (
      !compareDateMatch(selectedDate, prevSelectedDate, "d") &&
      !compareSameWeek(selectedDate, prevSelectedDate)
    ) {
      console.log("년월이 같고 일과 주가 다르다");
      setWeeks(getWeeks(getSunday(selectedDate)));
    }
    setPrevSelectedDate(selectedDate);
    setADay(selectedDate);
  }, [selectedDate]);

  const getActiveMembers = (groups: GroupWithOptions[]) => {
    const activeGroups = groups?.filter((group) => group.activation === true);
    const emptyArr: GroupMemberWithOptions[] = [];
    return activeGroups?.reduce(
      (previousValue, currentValue) =>
        previousValue.concat(currentValue.members),
      emptyArr
    );
  };
  if (!viewOptions) {
    return <></>;
  }
  return (
    <>
      <div className="timetable-container h-full w-full text-xs">
        <nav className="container-header mb-3 px-2 pb-4 shadow-b">
          <div className="flex justify-between">
            <div className="flex">
              <button
                className="min-w-[120px] text-sm font-medium text-gray-700 hover:font-bold"
                onClick={() => setSelectedDate(today)}
              >
                {selectedDate.toLocaleString("ko-KR", {
                  year: "2-digit",
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                })}
              </button>
            </div>
            <div className="flex w-full items-center justify-end space-x-3">
              <div className="group-view-controller">
                <FontAwesomeIcon
                  icon={faBars}
                  onClick={() => {
                    const newViewOptions = {
                      ...viewOptions,
                      seeActiveOption: !viewOptions.seeActiveOption,
                    };
                    localStorage.setItem(
                      LOCALSTORAGE_VIEW_OPTION + loginUser.me.id,
                      JSON.stringify(newViewOptions)
                    );
                    viewOptionsVar(newViewOptions);
                  }}
                  className="cursor-pointer"
                />
                {viewOptions.seeActiveOption && (
                  <ul className="absolute z-50 rounded-md bg-white p-4 shadow-cst">
                    {groupLists?.map((group) => (
                      <li key={group.id}>
                        <Switch
                          key={group.id}
                          enabled={group.activation}
                          label={group.name}
                          onClick={() => {
                            const index = groupLists.findIndex(
                              (prevGroup) => prevGroup.id === group.id
                            );
                            if (index === -1) return;
                            const newState = [...groupLists];
                            newState[index].activation =
                              newState[index].activation === true
                                ? false
                                : true;
                            // setGroupLists(newState);
                            localStorage.setItem(
                              LOCALSTORAGE_VIEW_OPTION_GROUPS + loginUser.me.id,
                              JSON.stringify(newState)
                            );
                            groupListsVar(newState);
                          }}
                        />
                        <ul>
                          {group.members.map((member) => (
                            <li
                              key={member.id}
                              className={cls(
                                group.activation ? "" : "text-gray-400",
                                member.activation ? "" : "text-gray-400",
                                "flex cursor-pointer items-center justify-between"
                              )}
                              onClick={() => {
                                const gIndex = groupLists.findIndex(
                                  (prevGroup) => prevGroup.id === group.id
                                );
                                if (gIndex === -1) return;
                                const mIndex = group.members.findIndex(
                                  (prevMember) => prevMember.id === member.id
                                );
                                if (mIndex === -1) return;

                                const newState = [...groupLists];
                                newState[gIndex].members[mIndex].activation =
                                  newState[gIndex].members[mIndex]
                                    .activation === true
                                    ? false
                                    : true;
                                // setGroupLists(newState);
                                localStorage.setItem(
                                  LOCALSTORAGE_VIEW_OPTION_GROUPS +
                                    loginUser.me.id,
                                  JSON.stringify(newState)
                                );
                                groupListsVar(newState);
                              }}
                            >
                              {member.user.name}
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                className={cls(
                                  group.activation
                                    ? member.activation
                                      ? "text-green-500"
                                      : ""
                                    : ""
                                )}
                              />
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Switch
                enabled={viewOptions.seeCancel}
                label={"취소"}
                onClick={() => {
                  const newViewOptions = {
                    ...viewOptions,
                    seeCancel: !viewOptions.seeCancel,
                  };
                  localStorage.setItem(
                    LOCALSTORAGE_VIEW_OPTION + loginUser.me.id,
                    JSON.stringify(newViewOptions)
                  );
                  viewOptionsVar(newViewOptions);
                }}
              />
              <Switch
                enabled={viewOptions.seeNoshow}
                label={"부도"}
                onClick={() => {
                  const newViewOptions = {
                    ...viewOptions,
                    seeNoshow: !viewOptions.seeNoshow,
                  };
                  localStorage.setItem(
                    LOCALSTORAGE_VIEW_OPTION + loginUser.me.id,
                    JSON.stringify(newViewOptions)
                  );
                  viewOptionsVar(newViewOptions);
                }}
              />
              <Switch
                enabled={viewOptions.periodToView === ONE_DAY ? false : true}
                label={"1주일"}
                onClick={() => {
                  const newViewOptions: IViewOption = {
                    ...viewOptions,
                    periodToView:
                      viewOptions.periodToView === ONE_DAY ? ONE_WEEK : ONE_DAY,
                  };
                  localStorage.setItem(
                    LOCALSTORAGE_VIEW_OPTION + loginUser.me.id,
                    JSON.stringify(newViewOptions)
                  );
                  viewOptionsVar(newViewOptions);
                }}
              />
            </div>
            <div className="flex w-full items-center justify-end space-x-5">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                onClick={() => {
                  const newViewOptions = {
                    ...viewOptions,
                    navigationExpand: !viewOptions.navigationExpand,
                  };
                  localStorage.setItem(
                    LOCALSTORAGE_VIEW_OPTION + loginUser.me.id,
                    JSON.stringify(newViewOptions)
                  );
                  viewOptionsVar(newViewOptions);
                }}
                className={cls(
                  viewOptions.navigationExpand
                    ? "text-gray-700"
                    : "text-gray-400",
                  "w-4 cursor-pointer hover:text-gray-500"
                )}
              />
              <FontAwesomeIcon
                icon={faList}
                onClick={() => {
                  const newViewOptions = {
                    ...viewOptions,
                    seeList: !viewOptions.seeList,
                  };
                  localStorage.setItem(
                    LOCALSTORAGE_VIEW_OPTION + loginUser.me.id,
                    JSON.stringify(newViewOptions)
                  );
                  viewOptionsVar(newViewOptions);
                }}
                className={cls(
                  viewOptions.seeList ? "text-gray-700" : "text-gray-400",
                  "w-4 cursor-pointer hover:text-gray-500"
                )}
              />
              {/* 이 버튼을 누르면 그룹원들 예약 동시출력 */}
              <Link to={"/group"}>
                <FontAwesomeIcon
                  icon={faUserGroup}
                  className="w-4 cursor-pointer text-gray-400 hover:text-gray-500"
                />
              </Link>
            </div>
          </div>
          {viewOptions.navigationExpand && (
            <div className="mx-4 mt-4 flex items-center justify-between">
              <MoveXBtn
                direction={"prev"}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                dateNavExpand={viewOptions.navigationExpand}
              />
              <div className="grid w-full grid-cols-7">
                {daysOfMonth.map((day, i) => (
                  <div
                    onClick={() => setSelectedDate(day.date)}
                    key={i}
                    className={cls(
                      "flex w-full cursor-pointer flex-col text-center hover:border-b-gray-500 hover:font-extrabold",
                      compareDateMatch(day.date, selectedDate, "ymd")
                        ? "border-b-2 border-sky-400 font-bold"
                        : "border-b-2 border-transparent"
                    )}
                  >
                    <span
                      className={cls(
                        "rounded-full",
                        day.date.getDay() === 0
                          ? "text-red-600"
                          : day.date.getDay() === 6
                          ? "text-blue-600"
                          : "text-gray-600",
                        selectedDate.getDate() === day.date.getDate()
                          ? "opacity-100"
                          : "opacity-80",
                        selectedDate.getMonth() !== day.date.getMonth()
                          ? "opacity-30"
                          : ""
                      )}
                    >
                      {day.date.getDate()}
                    </span>
                  </div>
                ))}
              </div>
              <MoveXBtn
                direction={"after"}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                dateNavExpand={viewOptions.navigationExpand}
              />
            </div>
          )}
        </nav>
        {!viewOptions.seeList ? (
          <>
            {viewOptions.periodToView === 7 && (
              <>
                <div className="table-header w-full">
                  <div className="grid grid-cols-cal_week">
                    <div className="title-col" />
                    {weeks.map((day, i) => (
                      <div
                        key={i}
                        className={cls(
                          "mx-auto",
                          day.date.getDay() === 0
                            ? "text-red-600 group-hover:text-red-400"
                            : day.date.getDay() === 6
                            ? "text-blue-600 group-hover:text-blue-400"
                            : "text-gray-600 group-hover:text-gray-400",
                          selectedDate.getMonth() !== day.date.getMonth()
                            ? "opacity-40"
                            : ""
                        )}
                      >
                        <BtnDatecheck
                          text={day.date.toLocaleDateString("ko-KR", {
                            month: "short",
                            day: "numeric",
                            weekday: "short",
                          })}
                          day={day.date.getDay()}
                          thisMonth={
                            selectedDate.getMonth() === day.date.getMonth()
                          }
                          selected={
                            selectedDate.getDate() === day.date.getDate()
                          }
                          onClick={() => setSelectedDate(day.date)}
                        />
                      </div>
                    ))}
                    <div
                      className={cls(
                        viewOptions.navigationExpand ? "invisible" : "",
                        "absolute left-0"
                      )}
                    >
                      <BtnArrow
                        direction="prev"
                        onClick={handleDateNavMovePrev}
                      />
                    </div>
                    <div
                      className={cls(
                        viewOptions.navigationExpand ? "invisible" : "",
                        "absolute right-0"
                      )}
                    >
                      <BtnArrow
                        direction="after"
                        onClick={handleDateNavMoveNext}
                      />
                    </div>
                  </div>
                </div>
                {/* -------------  절취선  ------------- */}
                <div className="table-sub-header mt-1.5 w-full">
                  <div className="grid grid-cols-cal_week">
                    <div className="title-col" />
                    {weekEvents.map((day, i) => (
                      <div
                        key={i}
                        className={cls(
                          "",
                          selectedDate.getMonth() !== day.date.getMonth()
                            ? "opacity-40"
                            : ""
                        )}
                      >
                        <div className="flex h-4 justify-around">
                          {day.users.map(
                            (member) =>
                              member.activation && (
                                <div
                                  key={member.id}
                                  className={cls(
                                    member.user.name === loginUser?.me.name
                                      ? "font-semibold"
                                      : ""
                                  )}
                                >
                                  {member.user.name}
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="body-table relative h-full overflow-y-scroll pt-1.5">
                  <TimeIndicatorBar labels={labels} />
                  <div className="row-table absolute h-full w-full">
                    {labels.map((label) => (
                      <div
                        key={label.valueOf()}
                        className={cls(
                          compareNumAfterGetMinutes(label, [0, 30])
                            ? "border-t"
                            : "",
                          "grid h-5 grid-cols-cal_week divide-x divide-black"
                        )}
                      >
                        <div
                          className={cls(
                            compareNumAfterGetMinutes(label, [0, 30])
                              ? "bg-white"
                              : "",
                            "title-col relative -top-2.5"
                          )}
                        >
                          {compareNumAfterGetMinutes(label, [0, 30])
                            ? getHHMM(label)
                            : ""}
                        </div>
                        {weeks.map((day, i) => (
                          <div key={i} className="relative z-30">
                            <div
                              className="group absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center px-0.5 hover:cursor-pointer hover:rounded-md hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 hover:shadow"
                              onClick={() => onClickRserve(day.date, label)}
                            >
                              <div className="invisible mx-auto flex flex-col whitespace-nowrap text-sm font-medium text-white group-hover:visible sm:flex-row">
                                <span>
                                  {label.toLocaleString("ko-KR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                <span>예약하기</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="col-table absolute h-full w-full">
                    <div className="grid h-full grid-cols-cal_week">
                      <div className="title-col" />
                      {weekEvents.map((day, i) => (
                        <div
                          key={i}
                          className="event-col relative grid"
                          style={{
                            gridTemplateColumns: `repeat(${
                              day.users.filter((member) => member.activation)
                                .length
                            }, 1fr)`,
                          }}
                        >
                          {day.users?.map(
                            (member, userIndex) =>
                              member.activation && (
                                <div
                                  key={member.id}
                                  className="user-col relative"
                                >
                                  {member.events?.map((event) => (
                                    <div
                                      key={event.id}
                                      onClick={() => onClickEventBox(event.id)}
                                      className={cls(
                                        "absolute z-40 cursor-pointer rounded-md border",
                                        userIndex === 0
                                          ? "border-sky-300 bg-sky-100"
                                          : userIndex === 1
                                          ? "border-indigo-300 bg-indigo-100"
                                          : userIndex === 2
                                          ? "border-lime-300 bg-lime-100"
                                          : userIndex === 3
                                          ? "border-cyan-300 bg-cyan-100"
                                          : "",
                                        !viewOptions.seeCancel &&
                                          event.state ===
                                            ReservationState.Canceled
                                          ? "hidden"
                                          : !viewOptions.seeNoshow &&
                                            event.state ===
                                              ReservationState.NoShow
                                          ? "hidden"
                                          : event.state ===
                                              ReservationState.NoShow ||
                                            event.state ===
                                              ReservationState.Canceled
                                          ? "opacity-60"
                                          : ""
                                      )}
                                      style={{
                                        inset: `${
                                          labels.findIndex((label) =>
                                            compareDateMatch(
                                              label,
                                              new Date(event.startDate),
                                              "hm"
                                            )
                                          ) * 20
                                        }px 0%`,
                                        height: `${
                                          getTimeLength(
                                            event.startDate,
                                            event.endDate
                                          ) * 2
                                        }px`,
                                        backgroundColor:
                                          event.state ===
                                          ReservationState.NoShow
                                            ? colorsObj.yellow[50].rgb
                                            : event.state ===
                                              ReservationState.Canceled
                                            ? colorsObj.red[50].rgb
                                            : "",
                                        borderColor:
                                          event.state ===
                                          ReservationState.NoShow
                                            ? colorsObj.yellow[300].rgb
                                            : event.state ===
                                              ReservationState.Canceled
                                            ? colorsObj.red[300].rgb
                                            : "",
                                      }}
                                    >
                                      {event.patient.name}
                                    </div>
                                  ))}
                                </div>
                              )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            {viewOptions.periodToView === 1 && (
              <>
                <div className="table-header w-full">
                  <div className="grid grid-cols-cal_week">
                    <div className="title-col" />
                    {weeks.map((day, i) => (
                      <div
                        key={i}
                        className={cls(
                          "mx-auto",
                          day.date.getDay() === 0
                            ? "text-red-600 group-hover:text-red-400"
                            : day.date.getDay() === 6
                            ? "text-blue-600 group-hover:text-blue-400"
                            : "text-gray-600 group-hover:text-gray-400",
                          selectedDate.getMonth() !== day.date.getMonth()
                            ? "opacity-40"
                            : ""
                        )}
                      >
                        <BtnDatecheck
                          text={day.date.getDate() + ""}
                          day={day.date.getDay()}
                          thisMonth={
                            selectedDate.getMonth() === day.date.getMonth()
                          }
                          selected={
                            selectedDate.getDate() === day.date.getDate()
                          }
                          onClick={() => setSelectedDate(day.date)}
                        />
                      </div>
                    ))}
                    <div
                      className={cls(
                        viewOptions.navigationExpand ? "invisible" : "",
                        "absolute left-0"
                      )}
                    >
                      <BtnArrow
                        direction="prev"
                        onClick={handleDateNavMovePrev}
                      />
                    </div>
                    <div
                      className={cls(
                        viewOptions.navigationExpand ? "invisible" : "",
                        "absolute right-0"
                      )}
                    >
                      <BtnArrow
                        direction="after"
                        onClick={handleDateNavMoveNext}
                      />
                    </div>
                  </div>
                </div>
                <div className="table-sub-header mt-1.5 w-full">
                  <div className="grid grid-cols-cal_day">
                    <div className="title-col" />
                    <div
                      className={cls(
                        "",
                        selectedDate.getMonth() !==
                          weekEvents[selectedDate.getDay()].date.getMonth()
                          ? "opacity-40"
                          : ""
                      )}
                    >
                      <div className="flex h-4 justify-around">
                        {weekEvents[selectedDate.getDay()].users.map(
                          (user, i) =>
                            user.activation && (
                              <div
                                key={user.id}
                                className={cls(
                                  user.user.name === loginUser?.me.name
                                    ? "font-semibold"
                                    : ""
                                )}
                              >
                                {user.user.name}
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="body-table relative h-full overflow-x-scroll pt-1.5">
                  <TimeIndicatorBar labels={labels} />
                  <div className="row-table absolute h-full w-full">
                    {labels.map((label) => (
                      <div
                        key={label.valueOf()}
                        className={cls(
                          compareNumAfterGetMinutes(label, [0, 30])
                            ? "border-t"
                            : "",
                          "grid h-5 grid-cols-cal_day"
                        )}
                      >
                        <div
                          className={cls(
                            compareNumAfterGetMinutes(label, [0, 30])
                              ? "border-t bg-white"
                              : "",
                            "title-col relative -top-2.5"
                          )}
                        >
                          {compareNumAfterGetMinutes(label, [0, 30])
                            ? getHHMM(label)
                            : ""}
                        </div>
                        <div className="relative z-30">
                          <div
                            className="group absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center px-0.5 hover:cursor-pointer hover:rounded-md hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 hover:shadow"
                            onClick={() => onClickRserve(aDay, label)}
                          >
                            <div className="invisible mx-auto flex flex-col whitespace-nowrap text-sm font-medium text-white group-hover:visible sm:flex-row">
                              <span>
                                {label.toLocaleString("ko-KR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span>예약하기</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-table absolute h-full w-full">
                    <div className="grid h-full grid-cols-cal_day">
                      <div className="title-col" />
                      <div
                        className="event-col relative grid border-x border-black"
                        style={{
                          gridTemplateColumns: `repeat(${
                            weekEvents[selectedDate.getDay()].users.length
                          }, 1fr)`,
                        }}
                      >
                        {weekEvents[selectedDate.getDay()].users?.map(
                          (user) => (
                            <div key={user.id} className="user-col relative">
                              {user.events?.map((event) => (
                                <div
                                  key={event.id}
                                  onClick={() => onClickEventBox(event.id)}
                                  className={cls(
                                    "absolute z-40 cursor-pointer rounded-md border border-sky-300 bg-sky-100",
                                    !viewOptions.seeCancel &&
                                      event.state === ReservationState.Canceled
                                      ? "hidden"
                                      : !viewOptions.seeNoshow &&
                                        event.state === ReservationState.NoShow
                                      ? "hidden"
                                      : event.state ===
                                          ReservationState.NoShow ||
                                        event.state ===
                                          ReservationState.Canceled
                                      ? "opacity-60"
                                      : ""
                                  )}
                                  style={{
                                    inset: `${
                                      labels.findIndex((label) =>
                                        compareDateMatch(
                                          label,
                                          new Date(event.startDate),
                                          "hm"
                                        )
                                      ) * 20
                                    }px 0%`,
                                    height: `${
                                      getTimeLength(
                                        event.startDate,
                                        event.endDate
                                      ) * 2
                                    }px`,
                                    backgroundColor:
                                      event.state === ReservationState.NoShow
                                        ? colorsObj.yellow[50].rgb
                                        : event.state ===
                                          ReservationState.Canceled
                                        ? colorsObj.red[50].rgb
                                        : "",
                                    borderColor:
                                      event.state === ReservationState.NoShow
                                        ? colorsObj.yellow[300].rgb
                                        : event.state ===
                                          ReservationState.Canceled
                                        ? colorsObj.red[300].rgb
                                        : "",
                                  }}
                                >
                                  {event.patient.name}
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : viewOptions.periodToView === 1 ? (
          <div className="event-col relative grid border-x border-black">
            <div>
              {selectedDate.toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
                weekday: "short",
              })}
            </div>
            {weekEvents[selectedDate.getDay()].users?.map((user) => (
              <div key={user.id}>
                {user.events?.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onClickEventBox(event.id)}
                    className={cls(
                      "cursor-pointer space-x-4 rounded-md border border-sky-300 bg-sky-100",
                      !viewOptions.seeCancel &&
                        event.state === ReservationState.Canceled
                        ? "hidden"
                        : !viewOptions.seeNoshow &&
                          event.state === ReservationState.NoShow
                        ? "hidden"
                        : event.state === ReservationState.NoShow ||
                          event.state === ReservationState.Canceled
                        ? "opacity-60"
                        : ""
                    )}
                    style={{
                      backgroundColor:
                        event.state === ReservationState.NoShow
                          ? colorsObj.yellow[50].rgb
                          : event.state === ReservationState.Canceled
                          ? colorsObj.red[50].rgb
                          : "",
                      borderColor:
                        event.state === ReservationState.NoShow
                          ? colorsObj.yellow[300].rgb
                          : event.state === ReservationState.Canceled
                          ? colorsObj.red[300].rgb
                          : "",
                    }}
                  >
                    <span>{getHHMM(event.startDate, ":")}</span>
                    <span>{event.patient.name}</span>
                    <span>{user.user.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          viewOptions.periodToView === 7 && (
            <div className="event-col relative grid border-x border-black">
              {weekEvents.map((week) => (
                <>
                  <div>
                    {week.date.toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      weekday: "short",
                    })}
                  </div>
                  {week.users?.map((user) => (
                    <div key={user.id}>
                      {user.events?.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => onClickEventBox(event.id)}
                          className={cls(
                            "cursor-pointer space-x-4 rounded-md border border-sky-300 bg-sky-100",
                            !viewOptions.seeCancel &&
                              event.state === ReservationState.Canceled
                              ? "hidden"
                              : !viewOptions.seeNoshow &&
                                event.state === ReservationState.NoShow
                              ? "hidden"
                              : event.state === ReservationState.NoShow ||
                                event.state === ReservationState.Canceled
                              ? "opacity-60"
                              : ""
                          )}
                          style={{
                            backgroundColor:
                              event.state === ReservationState.NoShow
                                ? colorsObj.yellow[50].rgb
                                : event.state === ReservationState.Canceled
                                ? colorsObj.red[50].rgb
                                : "",
                            borderColor:
                              event.state === ReservationState.NoShow
                                ? colorsObj.yellow[300].rgb
                                : event.state === ReservationState.Canceled
                                ? colorsObj.red[300].rgb
                                : "",
                          }}
                        >
                          <span>{getHHMM(event.startDate, ":")}</span>
                          <span>{event.patient.name}</span>
                          <span>{user.user.name}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              ))}
            </div>
          )
        )}
      </div>
      {openEventModal && (
        <ModalPortal
          closeAction={setOpenEventModal}
          children={
            <ReservationDetail
              reservationId={eventIdForModal!}
              closeAction={setOpenEventModal}
            />
          }
        />
      )}
      {openReserveModal && (
        <ModalPortal
          closeAction={setOpenReserveModal}
          children={
            <Reserve2
              startDate={eventStartDate!}
              closeAction={setOpenReserveModal}
            />
          }
        />
      )}
    </>
  );
};