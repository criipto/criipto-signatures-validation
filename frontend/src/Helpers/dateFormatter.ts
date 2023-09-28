export const formattedDate = (timeStamp?: Date | null): string | null => {
  if (timeStamp) {
    const date: Date = new Date(timeStamp);
    return `${date.toJSON().slice(0, 19).replace('T', ' ')} (UTC)`;
  } else return null;
};
