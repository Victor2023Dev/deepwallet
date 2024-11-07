import React, {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { ThemeProvider } from "styled-components";

export type ThemeOption = "light" | "auto";

interface Theme {
  option: ThemeOption;
  setTheme: (option: ThemeOption) => void;
}

const initOption = () => {
  const theme = localStorage.getItem("theme-option");

  if (!theme) {
    return "light";
  }

  return theme as ThemeOption;
};

const AppThemeContext = createContext<Theme | null>(null);

export const useAppTheme = () => {
  const theme = useContext(AppThemeContext);

  if (!theme) {
    throw new Error("You have forgot to use theme provider");
  }

  return theme;
};

export const AppThemeProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [option, _setOption] = useState<ThemeOption>(() => initOption());
  const [displayTheme, setDisplayTheme] = useState<"light">("light");

  const setTheme = (option: ThemeOption) => {
    localStorage.setItem("theme-option", option);

    if (option === "auto") {
      setDisplayTheme("light");
    } else {
      setDisplayTheme(option);
    }

    _setOption(option);
  };

  useLayoutEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (option === "auto") {
          setDisplayTheme("light");
        }
      });
  }, [option]);

  return (
    <AppThemeContext.Provider
      value={{
        option,
        setTheme,
      }}
    >
      <ThemeProvider theme={{ mode: displayTheme }}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  );
};
