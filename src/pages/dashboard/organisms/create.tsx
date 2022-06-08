import { useForm } from "react-hook-form";
import { FormError } from "../../../components/form-error";
import { Button } from "../../../components/molecules/button";
import { Input } from "../../../components/molecules/input";
import {
  CreateClinicInput,
  useCreateClinicMutation,
} from "../../../graphql/generated/graphql";
import { DashboardSectionLayout } from "../components/section-layout";

export const CreateClinic = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<CreateClinicInput>({ mode: "onChange" });

  const [createClinicMutation, { loading, data }] = useCreateClinicMutation();

  const onSubmitCreateClinic = () => {
    if (!loading) {
      const { name } = getValues();
      createClinicMutation({
        variables: { input: { name } },
      });
    }
  };

  return (
    <DashboardSectionLayout
      title="병원 만들기"
      width="md"
      moreYGap
      heightFull
      children={
        <form
          onSubmit={handleSubmit(onSubmitCreateClinic)}
          className="space-y-6"
        >
          <Input
            name="name"
            label={"이름*"}
            placeholder={"병원 이름"}
            type="text"
            register={register("name", {
              required: "이름을 입력하세요",
              maxLength: { value: 30, message: "최대 30자 입니다" },
            })}
            children={
              <>
                {errors.name?.message && (
                  <FormError errorMessage={errors.name.message} />
                )}
                {data?.createClinic.error && (
                  <FormError errorMessage={data.createClinic.error} />
                )}
              </>
            }
          />
          <Button
            isWidthFull
            type="submit"
            textContents={"만들기"}
            canClick={isValid}
            loading={loading}
          />
        </form>
      }
    />
  );
};
