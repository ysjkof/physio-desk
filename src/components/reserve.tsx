import { useReactiveVar } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { SearchPatient } from "../components/search-patient";
import {
  CreateReservationMutation,
  useCreateReservationMutation,
} from "../graphql/generated/graphql";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faXmark } from "@fortawesome/free-solid-svg-icons";
import { DatepickerForm } from "../components/datepicker";
import {
  selectedGroupVar,
  groupListsVar,
  listReservationRefetchVar,
  selectedPatientVar,
} from "../store";
import { CreatePatient } from "../pages/create-patient";
import { PrescriptionsSelectType } from "../pages/time-table";
import { cls, getDateFromYMDHM } from "../libs/utils";
import { DatepickerWithInput } from "./datepicker-with-input";

interface ReserveForm extends DatepickerForm {
  memo?: string;
  therapistId?: number;
}

interface ReserveProps {
  startDate: Date;
  closeAction: React.Dispatch<React.SetStateAction<boolean>>;
  prescriptions: PrescriptionsSelectType;
}

export const Reserve = ({
  startDate,
  closeAction,
  prescriptions,
}: ReserveProps) => {
  const [openCreatePatient, setOpenCreatePatient] = useState(false);
  const [selectPrescriptionOptions, setSelectPrescriptionOptions] = useState(
    prescriptions.option
  );
  const [selectPrescriptionBundles, setSelectPrescriptionBundles] = useState(
    prescriptions.bundle
  );
  const [totalPrescription, setTotalPrescription] = useState({
    price: 0,
    minute: 0,
    options: [0],
    bundles: [0],
  });
  const selectedPatient = useReactiveVar(selectedPatientVar);
  const navigate = useNavigate();
  // 할일 : 예약하기에서 새로고침할 경우 아래 항목 때문에 디버거 활성화됨. 쿼리 시 인풋 변수가 비어있어서 에러남.
  // const listReservationRefetch = useReactiveVar(listReservationRefetchVar);
  const selectedGroup = useReactiveVar(selectedGroupVar);

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    watch,
  } = useForm<ReserveForm>({ mode: "onChange" });

  const onCompleted = (data: CreateReservationMutation) => {
    const {
      createReservation: { ok, error },
    } = data;
    if (error) {
      alert(`오류가 발생했습니다; ${error}`);
    }
    // listReservationRefetch();
    if (ok) closeAction(false);
  };

  const [
    createReservationMutation,
    { loading, data: createReservationResult },
  ] = useCreateReservationMutation({ onCompleted });

  const onSubmitText = () => {
    // test용
    const dateArr: Date[] = [];
    const firstDate = new Date("2022-5-1");
    for (let i = 0; i < 30; i++) {
      firstDate.setDate(i + 1);
      const today = new Date(firstDate);
      const loop = Math.floor(Math.random() * 8);
      let hours: Date[] = [];
      hours.length = loop;
      hours.fill(today);
      const newHours = hours.map((h) => {
        const loopdate = new Date(today);
        let th = Math.floor(Math.random() * (19 - 9) + 9);
        let tm = Math.floor(Math.random() * 6) * 10;
        tm === 6 ? (tm = 0) : "";
        while (hours.find((a) => a.getHours() === th)) {
          th = Math.floor(Math.random() * (19 - 9) + 9);
        }
        loopdate.setHours(th, tm, 0, 0);
        return loopdate;
      });
      newHours.forEach((e) => dateArr.push(e));
    }
    function geteddt(date: Date) {
      const dt = new Date(date);
      const dtm = dt.getMinutes();
      dt.setMinutes(dtm + 40);
      return dt;
    }
    dateArr.forEach((date) => {
      const prescriptionOptionIds = [
        prescriptions.option[
          Math.floor(Math.random() * prescriptions.option.length)
        ].id,
      ];
      const prescriptionBundleIds = [
        prescriptions.bundle[
          Math.floor(Math.random() * prescriptions.bundle.length)
        ].id,
      ];
      createReservationMutation({
        variables: {
          input: {
            startDate: date,
            endDate: geteddt(date),
            patientId: selectedPatient!.id,
            groupId: selectedGroup?.id,
            prescriptionOptionIds,
            // prescriptionBundleIds
          },
        },
      });
    });
  };
  const onSubmit = () => {
    if (!loading && selectedPatient?.id) {
      const {
        startDateYear,
        startDateMonth,
        startDateDate,
        startDateHours,
        startDateMinutes,
        memo,
        therapistId,
      } = getValues();
      // const startDate = new Date(
      //   `${startDateYear}-${String(startDateMonth).padStart(2, "0")}-${String(
      //     startDateDate
      //   ).padStart(2, "0")}T${String(startDateHours).padStart(2, "0")}:${String(
      //     startDateMinutes
      //   ).padStart(2, "0")}:00.000${UTC_OPTION_KST}`
      // );
      const startDate = getDateFromYMDHM(
        startDateYear,
        startDateMonth,
        startDateDate,
        startDateHours,
        startDateMinutes
      );
      const endDate = new Date(startDate);
      // startDate와 같은 값인 endDate에 치료시간을 분으로 더함
      endDate.setMinutes(endDate.getMinutes() + totalPrescription.minute);
      createReservationMutation({
        variables: {
          input: {
            startDate: startDate,
            endDate,
            memo,
            patientId: selectedPatient.id,
            therapistId: +therapistId!,
            groupId: selectedGroup?.id,
            prescriptionOptionIds: totalPrescription.options,
            prescriptionBundleIds: totalPrescription.bundles,
          },
        },
      });
    }
  };
  const groupLists = useReactiveVar(groupListsVar);

  const onClickPrescription = (id: number, type: "bundle" | "option") => {
    let setFunction:
      | typeof setSelectPrescriptionBundles
      | typeof setSelectPrescriptionOptions = setSelectPrescriptionOptions;
    if (type === "bundle") {
      setFunction = setSelectPrescriptionBundles;
    }
    // @ts-ignore
    setFunction((prevState) =>
      // @ts-ignore
      prevState.map((prev) => {
        if (prev.id === id) {
          return { ...prev, isSelect: !prev.isSelect };
        }
        return prev;
      })
    );
  };

  useEffect(() => {
    if (!startDate) navigate(-1);
    return () => {
      selectedPatientVar(null);
    };
  }, []);

  function getTotal(
    getThis: "price" | "requiredTime",
    firstPrescription: typeof selectPrescriptionOptions,
    secondPrescription: typeof selectPrescriptionBundles
  ) {
    return (
      firstPrescription
        .filter((pre) => pre.isSelect)
        .reduce((prev, curr) => prev + curr[getThis], 0) +
      secondPrescription
        .filter((pre) => pre.isSelect)
        .reduce((prev, curr) => prev + curr[getThis], 0)
    );
  }

  useEffect(() => {
    setTotalPrescription({
      minute: getTotal(
        "requiredTime",
        selectPrescriptionOptions,
        selectPrescriptionBundles
      ),
      price: getTotal(
        "price",
        selectPrescriptionOptions,
        selectPrescriptionBundles
      ),
      bundles: selectPrescriptionBundles
        .filter((pre) => pre.isSelect)
        .map((pre) => pre.id),
      options: selectPrescriptionOptions
        .filter((pre) => pre.isSelect)
        .map((pre) => pre.id),
    });
  }, [selectPrescriptionBundles, selectPrescriptionOptions]);

  useEffect(() => {
    if (!selectedPatient) {
      setValue("therapistId", 0);
    } else {
      setValue("therapistId", selectedPatient?.therapist?.id);
    }
  }, [selectedPatient]);

  return (
    <>
      <Helmet>
        <title>예약하기 | Muool</title>
      </Helmet>
      <div className="my-auto h-[600px] w-[400px] bg-white p-5 sm:rounded-lg">
        <button
          className="absolute right-6 top-5 hover:text-gray-400"
          onClick={() => closeAction(false)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {openCreatePatient ? (
          <CreatePatient
            groupId={selectedGroup?.id ?? undefined}
            groupName={selectedGroup?.name ?? undefined}
            closeModal={setOpenCreatePatient}
          />
        ) : (
          <>
            <h4 className="mb-5 w-full text-3xl font-medium">
              예약하기
              {selectedGroup === null || selectedGroup.id === null ? (
                ""
              ) : (
                <span className="ml-2 text-base font-normal">
                  {
                    groupLists?.find((group) => group.id === selectedGroup?.id)
                      ?.name
                  }
                </span>
              )}
            </h4>
            <button
              className="absolute top-14 right-10 rounded-md border px-2 text-gray-500 hover:text-gray-700"
              onClick={() => setOpenCreatePatient((current) => !current)}
            >
              환자등록
            </button>
            <SearchPatient selectedGroup={selectedGroup} />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-5 mb-5 grid w-full gap-3"
            >
              {errors.startDateYear?.message && (
                <FormError errorMessage={errors.startDateYear?.message} />
              )}
              {errors.startDateMonth?.message && (
                <FormError errorMessage={errors.startDateMonth?.message} />
              )}
              {errors.startDateDate?.message && (
                <FormError errorMessage={errors.startDateDate?.message} />
              )}
              {errors.startDateHours?.message && (
                <FormError errorMessage={errors.startDateHours?.message} />
              )}
              {errors.startDateMinutes?.message && (
                <FormError errorMessage={errors.startDateMinutes?.message} />
              )}
              <label>담당 치료사</label>
              <div className="flex justify-between">
                <select
                  {...register("therapistId")}
                  className="w-full text-center"
                >
                  <option value="0">- 담당 치료사를 선택하세요 -</option>
                  {groupLists
                    ?.find((g) => g.id === selectedGroup?.id)
                    ?.members.map((m) => (
                      <option key={m.id} value={m.user.id}>
                        {m.user.name}
                      </option>
                    ))}
                </select>
              </div>
              <label>예약 시간</label>
              <DatepickerWithInput
                setValue={setValue}
                defaultDate={startDate}
                register={register}
                see="ymd-hm"
                dateType="startDate"
              />
              <label className="flex items-center gap-2">
                처방
                <Link
                  to={"/dashboard"}
                  state={{
                    selectedGroupId: selectedGroup?.id,
                    selectedGroupName: selectedGroup?.name,
                    selectedMenu: "prescription",
                  }}
                >
                  <FontAwesomeIcon icon={faLink} />
                </Link>
              </label>
              <div>
                {selectPrescriptionBundles.length === 0 &&
                selectPrescriptionOptions.length === 0 ? (
                  <div className="flex flex-col items-center px-2 text-gray-600">
                    <span>등록된 처방이 없습니다.</span>
                    <span>
                      처방을
                      <Link
                        to={"/dashboard"}
                        state={{
                          selectedGroupId: selectedGroup?.id,
                          selectedGroupName: selectedGroup?.name,
                          selectedMenu: "prescription",
                        }}
                      >
                        <button
                          type="button"
                          className="btn-sm btn-border mx-2 w-fit shadow-cst"
                        >
                          <FontAwesomeIcon icon={faLink} />
                          등록
                        </button>
                        하세요
                      </Link>
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ul className="grid grid-cols-3">
                      {selectPrescriptionBundles.map((prescription, index) => (
                        <li
                          key={index}
                          value={prescription.id}
                          onClick={() =>
                            onClickPrescription(prescription.id, "bundle")
                          }
                        >
                          <div
                            className={cls(
                              "btn-sm btn-border",
                              prescription.isSelect
                                ? "text-red-600"
                                : "text-blue-400"
                            )}
                          >
                            {prescription.name}
                          </div>
                        </li>
                      ))}
                      {selectPrescriptionOptions.map((prescription, index) => (
                        <li
                          key={index}
                          value={prescription.id}
                          className="cursor-point"
                          onClick={() =>
                            onClickPrescription(prescription.id, "option")
                          }
                        >
                          <div
                            className={cls(
                              "btn-sm btn-border",
                              prescription.isSelect
                                ? "text-red-600"
                                : "text-blue-400"
                            )}
                          >
                            {prescription.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-around">
                      <span>총가격 : {totalPrescription.price}원</span>
                      <span>치료시간 : {totalPrescription.minute}분</span>
                    </div>
                  </div>
                )}
              </div>
              <Button
                canClick={
                  selectedPatient &&
                  isValid &&
                  (totalPrescription.options[0] > 0 ||
                    totalPrescription.bundles[0] > 0)
                }
                loading={loading}
                actionText={"예약 등록"}
              />
              {createReservationResult?.createReservation.error && (
                <FormError
                  errorMessage={createReservationResult.createReservation.error}
                />
              )}
            </form>
          </>
        )}
      </div>
    </>
  );
};
