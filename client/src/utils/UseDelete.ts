export const UseDelete = (array: any, key: number) => {
  return array.filter((item: any, akey: any) => akey !== key);
};

export const UseDeleteBulk = (array: any, objectKey: any, name: any, isWinner: any) => {
  if (isWinner) {
    return array.filter((aitem: any, akey: any) => aitem[objectKey] === name);
  }
  return array.filter((aitem: any, akey: any) => aitem[objectKey] !== name);
};
