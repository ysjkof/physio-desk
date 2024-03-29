import { forwardRef, type MutableRefObject } from 'react';
import { cls } from '../utils/commonUtils';
import type {
  InputProps,
  InputPropsWithRegister,
  TextareaProps,
} from '../types/propsTypes';

const Input = ({ register, ...args }: InputProps) => {
  return (
    <input
      {...args}
      {...register}
      autoComplete="off"
      className={cls(
        'input',
        args.disabled ? 'pointer-events-none border-gray-200 bg-gray-200' : '',
        args.className || ''
      )}
    />
  );
};

const InputWithRef = forwardRef<HTMLInputElement, InputPropsWithRegister>(
  ({ label, register, ...args }, ref) => {
    const { ref: refOfRegister, ...rest } = register;
    return (
      <input
        {...args}
        id={label}
        className={cls('input', args.className || '')}
        {...rest}
        ref={(element) => {
          // share ref
          // register가 ref를 사용하기 때문에 share ref해야 forwardRef의 ref에 접근할 수 있다.
          if (!element) {
            return element;
          }
          refOfRegister(element);
          if (ref) {
            // eslint-disable-next-line no-param-reassign
            (ref as MutableRefObject<HTMLInputElement>).current = element;
          }
        }}
      />
    );
  }
);

InputWithRef.displayName = 'InputRefWrapper';

const Textarea = ({ register, ...args }: TextareaProps) => {
  return (
    <textarea
      {...args}
      {...register}
      className={cls(
        'rounded-md border px-3 py-2 placeholder:text-sm',
        args.className ? args.className : 'w-full'
      )}
    />
  );
};

export { Input, InputWithRef, Textarea };
