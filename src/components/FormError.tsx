import { cls } from '../utils/common.utils';

interface FormErrorProps {
  error: string;
}

export default function FormError({ error }: FormErrorProps) {
  return (
    <span
      className={cls(
        'absolute left-0 top-10 w-full whitespace-nowrap rounded-md px-2 py-1 text-center text-xs text-red-400'
      )}
    >
      {error}
    </span>
  );
}