import { SVG } from '../types/commonTypes';
import { cls } from '../utils/commonUtils';

/**
 * by JH
 */
const BuildingLargeWithX = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      width="58"
      height="49"
      viewBox="0 0 58 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={2}
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-20 w-20' : '',
        iconSize === 'MD' ? 'h-18 w-18' : '',
        iconSize === 'SM' ? 'h-6 w-6' : ''
      )}
    >
      <path d="M1 48H57" />
      <path d="M1 48H57" />
      <path d="M1 48H57" />
      <path d="M5.1665 46.8333V2C5.1665 1.44771 5.61422 1 6.1665 1H33.3332C33.8855 1 34.3332 1.44772 34.3332 2V46.8333" />
      <path d="M5.1665 46.8333V2C5.1665 1.44771 5.61422 1 6.1665 1H33.3332C33.8855 1 34.3332 1.44772 34.3332 2V46.8333" />
      <path d="M5.1665 46.8333V2C5.1665 1.44771 5.61422 1 6.1665 1H33.3332C33.8855 1 34.3332 1.44772 34.3332 2V46.8333" />
      <path d="M37.9998 26H49.7964C50.8292 26 51.6664 26.8372 51.6664 27.87V46.8333" />
      <path d="M37.9998 26H49.7964C50.8292 26 51.6664 26.8372 51.6664 27.87V46.8333" />
      <path d="M37.9998 26H49.7964C50.8292 26 51.6664 26.8372 51.6664 27.87V46.8333" />
      <path d="M17.9998 12L21.9998 12" />
      <path d="M17.9998 12L21.9998 12" />
      <path d="M17.9998 12L21.9998 12" />
      <path d="M19.9998 10L19.9998 14" />
      <path d="M19.9998 10L19.9998 14" />
      <path d="M19.9998 10L19.9998 14" />
      <path d="M24.134 22L15.8007 22" />
      <path d="M24.134 22L15.8007 22" />
      <path d="M24.134 22L15.8007 22" />
      <path d="M24.134 27L15.8007 27" />
      <path d="M24.134 27L15.8007 27" />
      <path d="M24.134 27L15.8007 27" />
      <path d="M24.134 47L24.134 35L15.8007 35L15.8007 47.5" />
      <path d="M24.134 47L24.134 35L15.8007 35L15.8007 47.5" />
      <path d="M24.134 47L24.134 35L15.8007 35L15.8007 47.5" />
      <rect x="15" y="7" width="10" height="10" rx="2" />
      <path d="M41 5L51 15" />
      <path d="M51 5L41 15" />
    </svg>
  );
};

export default BuildingLargeWithX;
