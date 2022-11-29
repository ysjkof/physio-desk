export const checkMatchMinute = (
  date: Date | string,
  minutes: number[]
): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const targetMinute = targetDate.getMinutes();
  return minutes.includes(targetMinute);
};

export const SchedulesStyle = {
  week: {
    template(userLength: number) {
      return {
        gridTemplateColumns: getGridTemplateColumns(7, userLength * 6),
      };
    },
    userColumn(userLength: number) {
      return {
        gridTemplateColumns: getGridTemplateColumns(userLength),
      };
    },
  },
  day: {
    template() {
      return {};
    },
    userColumn(userLength: number) {
      return { gridTemplateColumns: getGridTemplateColumns(userLength) };
    },
  },
};

export const getGridTemplateColumns = (repeat: number, minWidth?: number) => {
  return minWidth
    ? `repeat(${repeat}, minmax(${minWidth}rem, 1fr))`
    : `repeat(${repeat}, minmax(0, 1fr))`;
};
``;
