import { useAuthStates } from "@/contexts/authContext";
import axios from "axios";
import { useCallback } from "react";

export default function useAxios() {
  const { detailUser } = useAuthStates();

  const getAxios = useCallback(() => {
    axios.interceptors.request.use(
      (config) => {
        const token = detailUser.jwt;
        if (token) {
          config.headers["Authorization"] = "Bearer " + token;
        } else {
          config.headers["Authorization"] = undefined;
        }

        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    return axios;
  }, [detailUser.jwt]);

  return getAxios;
}
