import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Datepicker, DatepickerForm } from "./datepicker";
import { InputOfDatepicker } from "./input-of-datepicker";

interface IDatepickerWithInputProps {
  setValue: UseFormSetValue<DatepickerForm>;
  register: UseFormRegister<DatepickerForm>;
  defaultDate: Date;
  see: "ymd-hm" | "ymd";
  dateType: "startDate" | "endDate";
}

export const DatepickerWithInput = ({
  setValue,
  register,
  defaultDate,
  see,
  dateType,
}: IDatepickerWithInputProps) => {
  return (
    <div className="relative flex w-full items-center justify-between gap-1">
      <Datepicker
        setValue={setValue}
        defaultDate={defaultDate}
        see={see}
        prefix={dateType}
      />
      <InputOfDatepicker register={register} see={see} prefix={dateType} />
    </div>
  );
};
