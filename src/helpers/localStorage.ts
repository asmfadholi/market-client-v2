export const getLocalStorage = (item: string) => {
  const isClient = typeof window !== "undefined";
  if (!isClient) return "";
  return localStorage.getItem(item);
};

export const setLocalStorage = (item: string, value: string) => {
  const isClient = typeof window !== "undefined";
  if (!isClient) return "";
  return localStorage.setItem(item, value);
};
