type ObjectType = { [key: string]: any };

export const filterObj = <T extends ObjectType>(
  obj: T,
  allowedArr: (keyof T)[]
): Partial<T> => {
  return allowedArr.reduce((acc: Partial<T>, key: keyof T) => {
    if (obj[key]) acc[key] = obj[key];
    return acc;
  }, {});
};
