import { differenceInCalendarDays, parseISO } from "date-fns";

/* Format the date string i.e. 'tomorrow', 'today', 'yesterday', 'in 2 days', etc */
export const formatDays = (dueDate) => {
  const differenceInDays = differenceInCalendarDays(
    parseISO(dueDate),
    new Date()
  );
  return differenceInDays > 1
    ? `in ${differenceInDays} days`
    : differenceInDays === 1
    ? `tomorrow`
    : differenceInDays === 0
    ? `today`
    : differenceInDays === -1
    ? `yesterday`
    : `${-differenceInDays} days ago`;
};
