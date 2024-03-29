import { SVG } from '../types/commonTypes';

/**
 * fonts.google.com/icons
 * Quick Reference All
 */
const QuickRef = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      viewBox="0 96 960 960"
      width="48"
      fill="currentColor"
      {...args}
    >
      <path d="M180 236v293-3 390-680 186-186Zm99 400h185q11-17 24-32t29-28H279v60Zm0 170h156q-3-15-4.5-30t-.5-30H279v60Zm-99 170q-24 0-42-18t-18-42V236q0-24 18-42t42-18h361l219 219v154q-14-7-29-12t-31-8V422H511V236H180v680h315q20 21 44.5 36t53.5 24H180Zm480-110q47 0 78.5-31.5T770 756q0-47-31.5-78.5T660 646q-47 0-78.5 31.5T550 756q0 47 31.5 78.5T660 866Zm204 136L756.837 895Q736 909 711.5 917.5 687 926 660 926q-70.833 0-120.417-49.618Q490 826.765 490 755.882 490 685 539.618 635.5q49.617-49.5 120.5-49.5Q731 586 780.5 635.583 830 685.167 830 756q0 27-8.5 51.5T799 852.837L906 960l-42 42Z" />
    </svg>
  );
};

export default QuickRef;
