import { SVG } from '../types/common.types';
import { cls } from '../utils/common.utils';

/**
 * by JH
 */
const TrashPot = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#8d8dad"
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-6 w-6' : '',
        iconSize === 'MD' ? 'h-4 w-4' : '',
        iconSize === 'SM' ? 'h-3 w-3' : ''
      )}
    >
      <path
        d="M22.22 4.92007H16.4533V2.994C16.4263 2.25566 16.1075 1.55817 15.5671 1.05443C15.0266 0.550695 14.3084 0.281815 13.57 0.306735H10.11C9.37156 0.281815 8.65339 0.550695 8.1129 1.05443C7.57241 1.55817 7.2537 2.25566 7.22664 2.994V4.92007H1.45997C1.15409 4.92007 0.860736 5.04158 0.644444 5.25787C0.428152 5.47416 0.306641 5.76752 0.306641 6.0734C0.306641 6.37928 0.428152 6.67264 0.644444 6.88893C0.860736 7.10522 1.15409 7.22674 1.45997 7.22674H2.61331V19.9134C2.61331 20.8311 2.97784 21.7111 3.62672 22.36C4.27559 23.0089 5.15566 23.3734 6.07331 23.3734H17.6066C18.5243 23.3734 19.4044 23.0089 20.0532 22.36C20.7021 21.7111 21.0666 20.8311 21.0666 19.9134V7.22674H22.22C22.5259 7.22674 22.8192 7.10522 23.0355 6.88893C23.2518 6.67264 23.3733 6.37928 23.3733 6.0734C23.3733 5.76752 23.2518 5.47416 23.0355 5.25787C22.8192 5.04158 22.5259 4.92007 22.22 4.92007ZM9.53331 2.994C9.53331 2.80947 9.77551 2.6134 10.11 2.6134H13.57C13.9044 2.6134 14.1466 2.80947 14.1466 2.994V4.92007H9.53331V2.994Z"
        fill="#8D8DAD"
      />
    </svg>
  );
};

export default TrashPot;