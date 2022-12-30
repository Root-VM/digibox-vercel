export interface StrapiDataInterface {
  data: Array<any>,
  meta: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    }
  }
}
