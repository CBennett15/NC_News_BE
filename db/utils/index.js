exports.convertDate = (arr) => {
  if (!arr.length) return [];

  const formattedDate = arr.map((obj) => {
    const timestamp = obj.created_at;
    const convertTime = new Date(timestamp);
    const { created_at, ...restOfObj } = obj;
    return { ...restOfObj, created_at: convertTime };
  });

  return formattedDate;
};
