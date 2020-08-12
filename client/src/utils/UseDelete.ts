export const UseDelete = (array: any, key: number) => {
  return array.filter((item: any, akey: any) => akey !== key);
};

export const UseDeleteBulk = (array: any, objectKey: any) => {
  return array.filter((aitem: any, akey: any) => aitem[objectKey] === false);
};
