import {
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
  createContext,
  useCallback,
} from "react";
import { noop } from "@/helpers/noop";
import { Alert, AlertColor, Snackbar } from "@mui/material";

interface SetShowSnackbarArg {
  show: boolean;
  message?: string;
  type?: AlertColor;
}

interface SnackbarContextActionsProps {
  setShowSnackbar: (arg: SetShowSnackbarArg) => void;
}

const SnackbarContextActions = createContext<SnackbarContextActionsProps>({
  setShowSnackbar: noop,
});

const defaultSnackbar = {
  show: false,
  message: "",
  type: "info" as AlertColor,
};

const SnackbarProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [show, setShow] = useState(defaultSnackbar);

  const setShowSnackbar = useCallback(
    ({ show, message, type }: SetShowSnackbarArg) => {
      if (!show) {
        setShow((prev) => ({ ...prev, show: false }));
      } else {
        setShow({ message: message || "", type: type || "info", show });
      }
    },
    []
  );

  const actionValues = useMemo(
    () => ({
      setShowSnackbar,
    }),
    [setShowSnackbar]
  );

  return (
    <SnackbarContextActions.Provider value={actionValues}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={show.show}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar({ show: false })}
      >
        <Alert
          onClose={() => setShowSnackbar({ show: false })}
          severity={show.type}
          sx={{ width: "100%" }}
        >
          {show.message}
        </Alert>
      </Snackbar>
    </SnackbarContextActions.Provider>
  );
};

export const useSnackbarActions = () => useContext(SnackbarContextActions);

export default SnackbarProvider;
