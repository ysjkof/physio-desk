import { type PropsWithChildren } from 'react';
import FormError from './FormError';
import { cls } from '../utils/commonUtils';

interface InputWrapperProps extends PropsWithChildren {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string | false;
  align?: 'row' | 'col';
}
const InputWrapper = ({
  children,
  label,
  htmlFor,
  required = false,
  error,
  align = 'row',
}: InputWrapperProps) => {
  const top = align === 'col' ? '0px' : undefined;

  return (
    <label
      htmlFor={htmlFor}
      className={cls(
        'input-wrapper relative flex min-h-[2.7rem] w-full justify-between text-base',
        align === 'row' ? 'items-center' : 'flex-col gap-1'
      )}
    >
      <span
        className={cls(
          'w-40 text-form-label ml-5',
          required
            ? 'before:absolute before:-left-2 before:ml-4 before:text-red-700 before:content-["*"]'
            : ''
        )}
      >
        {label}
      </span>
      <div className="relative w-full">{children}</div>
      {error && <FormError error={error} top={top} />}
    </label>
  );
};

export default InputWrapper;
