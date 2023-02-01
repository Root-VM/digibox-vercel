export const chatSort = (arr: Array<any>) => {
  return arr.sort((a,b) => a.step - b.step);
}
