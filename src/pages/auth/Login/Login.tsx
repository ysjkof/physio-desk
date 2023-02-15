import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { setToast } from '../../../store';
import { REG_EXP } from '../../../constants/regex';
import { MUOOL } from '../../../constants/constants';
import { LOGIN_DOCUMENT } from '../../../graphql';
import type { LoginInput, LoginMutation } from '../../../types/generatedTypes';
import { MenuButton, useLogin } from '../../../components';
import { Input } from '../../timetable/components/FormForReservation/InputForReserve';
import FormError from '../../../components/FormError';

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginInput>({ mode: 'onChange' });

  const printErrorText =
    errors.email?.message || errors.email?.type === 'pattern'
      ? REG_EXP.email.condition
      : errors.password?.message ||
        (errors.password?.type === 'pattern' && REG_EXP.password.condition);

  const [loginMutation, { loading }] =
    useMutation<LoginMutation>(LOGIN_DOCUMENT);

  const login = useLogin();

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      if (!email || !password) return;

      loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
        onCompleted(data) {
          const {
            login: { ok, token, error },
          } = data;

          if (error) {
            return setToast({ messages: [error] });
          }

          if (ok && token) {
            return login(token, () => navigate('/'));
          }
        },
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>로그인 | {MUOOL}</title>
      </Helmet>

      <h2 className="mb-8 text-center text-base font-semibold">
        무울시간표에 로그인
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mb-6 grid w-full gap-4"
      >
        <Input
          id="login__email"
          label="Email"
          type="email"
          placeholder="Email을 입력하세요"
          maxLength={REG_EXP.email.maxLength}
          register={register('email', {
            required: 'Email을 입력하세요',
            pattern: REG_EXP.email.pattern,
          })}
        />

        <Input
          id="login__password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          register={register('password', {
            required: '비밀번호를 입력하세요',
            pattern:
              process.env.NODE_ENV === 'production'
                ? REG_EXP.password.pattern
                : undefined,
          })}
        />
        <MenuButton
          type="submit"
          className="rounded-md bg-[#6BA6FF] text-base font-bold text-white"
        >
          로그인
        </MenuButton>
        {printErrorText && <FormError top="-1.75rem" error={printErrorText} />}
      </form>
    </>
  );
}
