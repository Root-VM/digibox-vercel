export const saveToStore = (name: string, data: any) => {
  window.localStorage.setItem(name, JSON.stringify(data));
}

export const loadFromStore = (name: string) => {
  const saved =  window.localStorage.getItem(name)
  return saved ? JSON.parse(saved) : null;
}
