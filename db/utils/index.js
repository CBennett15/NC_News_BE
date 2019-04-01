exports.convertDate = (timestamp) => {
  const formattedDate = new Date(timestamp);
  console.log(formattedDate);
  return formattedDate;
};

exports.formatData = (arr, func) => {
  if (!arr.length) return [];

  const formattedData = arr.map((obj) => {
    return obj.key;
  });

  return formattedData;
};
