export const getTimeObject = (time) => {
  const [hours, minutes, seconds] = time.split(":");
  const currentDate = new Date();
  const date = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    hours,
    minutes,
    seconds
  );

  return date;
};
