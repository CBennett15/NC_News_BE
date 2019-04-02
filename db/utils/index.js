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
exports.createRef = (arr, arg1 = 'title', arg2 = 'article_id') => {
  if (!arr.length) return {};
  const refObject = arr.reduce((newObj, currentObj) => {
    newObj[currentObj[arg1]] = currentObj[arg2];
    return newObj;
  }, {});
  return refObject;
};
exports.formatData = (data, refObj) => {
  // I don't know how to make this more generic - could do the same function but this isn't very DRY
  if (!data.length) return [];
  const formattedData = data.map((obj) => {
    const { belongs_to, ...restOfObj } = obj;
    return { ...restOfObj, article_id: refObj[belongs_to] };
  });

  return formattedData;
};
