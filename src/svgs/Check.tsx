import { SVG } from '../types/common.types';
import { cls } from '../utils/common.utils';

/**
 * heroicicons.com
 * Check > mini
 */
const Check = ({ iconSize, ...args }: SVG) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...args}
      className={cls(
        args.className || '',
        iconSize
          ? iconSize === 'LG'
            ? 'h-5 w-5'
            : iconSize === 'MD'
            ? 'h-4 w-4'
            : 'h-3 w-3'
          : 'h-4 w-4'
      )}
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default Check;
