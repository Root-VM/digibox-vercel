export const progressUrlDecode = (progress_query: string): null | {id: string, bot: number, user: number | null}[] => {
  if(progress_query) {
    const result =  progress_query.split('_').filter(v => v).map(el => {
      const res = el.split(':');

      return {
        bot: Number(res[0]),
        user: res[1] ? Number(res[1]) : null,
        id: el
      }
    })

    return result ? result : null;
  }

  return null;
}
