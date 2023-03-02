import { SVG } from '../types/commonTypes';

/**
 * fonts.google.com/icons
 * Gpp Maybe
 */
const Guard = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      viewBox="0 96 960 960"
      width="48"
      fill="currentColor"
      {...args}
    >
      <path d="M480 722q14.45 0 24.225-9.775Q514 702.45 514 688q0-14.45-9.775-24.225Q494.45 654 480 654q-14.45 0-24.225 9.775Q446 673.55 446 688q0 14.45 9.775 24.225Q465.55 722 480 722Zm-30-134h60V381h-60v207Zm30 387q-140-35-230-162.5T160 533V295l320-120 320 120v238q0 152-90 279.5T480 975Zm0-62q115-38 187.5-143.5T740 533V337l-260-98-260 98v196q0 131 72.5 236.5T480 913Zm0-337Z" />
    </svg>
  );
};

export default Guard;
