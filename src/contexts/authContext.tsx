import {
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
  createContext,
  useCallback,
} from "react";
import { noop } from "@/helpers/noop";
import axios from "axios";

interface SnackbarContextActionsProps {
  refetchDetailUser: () => void;
}

const AuthContextActions = createContext<SnackbarContextActionsProps>({
  refetchDetailUser: noop,
});

const detailUserEmpty = {
  id: 0,
  username: "",
  email: "",
  provider: "",
  confirmed: false,
  blocked: false,
  createdAt: "",
  updatedAt: "",
  jwt: "",
};

interface AuthContextStatesProps {
  detailUser: UserDetail;
}

const AuthContextStates = createContext<AuthContextStatesProps>({
  detailUser: detailUserEmpty,
});

interface UserDetail {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  jwt: string;
}

const USER_DETAIL_API = `${process.env.NEXT_PUBLIC_BASE_URL}/users/me`;

const AuthProvider = ({
  children,
  initDetailUser,
}: PropsWithChildren<{ initDetailUser: UserDetail }>) => {
  const [detailUser, setDetailUser] = useState(initDetailUser);

  const refetchDetailUser = useCallback(async () => {
    try {
      const resGetJwt = await axios.get<{ jwt: string }>("/api/get-jwt-cookie");
      const getJwt = resGetJwt.data.jwt;

      if (!getJwt) {
        setDetailUser(detailUserEmpty);
        return;
      }

      const resGetDetailUser = await axios.get<UserDetail>(USER_DETAIL_API, {
        headers: {
          Authorization: `Bearer ${getJwt}`,
        },
      });

      setDetailUser(resGetDetailUser.data);
    } catch {
      setDetailUser(detailUserEmpty);
    }
  }, []);

  const actionValues = useMemo(
    () => ({
      refetchDetailUser,
    }),
    [refetchDetailUser]
  );

  const statesValues = useMemo(
    () => ({
      detailUser,
    }),
    [detailUser]
  );

  return (
    <AuthContextStates.Provider value={statesValues}>
      <AuthContextActions.Provider value={actionValues}>
        {children}
      </AuthContextActions.Provider>
    </AuthContextStates.Provider>
  );
};

export const useAuthActions = () => useContext(AuthContextActions);
export const useAuthStates = () => useContext(AuthContextStates);

export default AuthProvider;
