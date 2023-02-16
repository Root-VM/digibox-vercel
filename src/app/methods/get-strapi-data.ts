export const mappedStrapiData = (data: any) => {
  if(data) {
    return data?.map((val: any) => {
      return {id: val.id, ...val.attributes}
    });
  }

  return null;
}
