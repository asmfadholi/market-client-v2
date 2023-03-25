import {
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
  createContext,
} from "react";
import { getLocalStorage, setLocalStorage } from "@/helpers/localStorage";
import { noop } from "@/helpers/noop";

interface ThemeContextActionsProps {
  toggleIsDark: () => void;
}

type ThemeContextStatesProps = {
  isDark: boolean;
};

const ThemeContextStates = createContext<ThemeContextStatesProps>({
  isDark: false,
});
const ThemeContextActions = createContext<ThemeContextActionsProps>({
  toggleIsDark: noop,
});

const getIsDark = () => Boolean(getLocalStorage("isDark"));

const ThemeProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getIsDark());
  }, []);

  const actionValues = useMemo(
    () => ({
      toggleIsDark: () => {
        setIsDark((prev) => {
          setLocalStorage("isDark", !prev ? "true" : "");
          return !prev;
        });
      },
    }),
    []
  );

  const stateValues = useMemo(
    () => ({
      isDark,
    }),
    [isDark]
  );

  return (
    <ThemeContextStates.Provider value={stateValues}>
      <ThemeContextActions.Provider value={actionValues}>
        {children}
      </ThemeContextActions.Provider>
    </ThemeContextStates.Provider>
  );
};

export const useThemeStates = () => useContext(ThemeContextStates);
export const useThemeActions = () => useContext(ThemeContextActions);

export default ThemeProvider;
