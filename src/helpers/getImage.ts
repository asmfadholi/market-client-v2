const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`.replace("/api", "");

export const getImage = (url: string) => {
  const isHttp = url.includes("http");
  if (!isHttp) {
    return `${BASE_URL}${url}`;
  }
  return url;
};
