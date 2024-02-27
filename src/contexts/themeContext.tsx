import {createContext, ReactNode, useState} from "react";


export const ThemeContext = createContext({
  isDark: true,
  switchTheme: (): void => {
  },
});

export default function ThemeContextWrapper(props: {
  children: ReactNode;
}) {
  const [isDarkTheme, changeIsDarkTheme] = useState(
    localStorage.getItem("theme") != "light",
  );
  const theme = isDarkTheme ? "dark" : "light";
  document.body.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);

  function switchTheme() {
    changeIsDarkTheme(!isDarkTheme);
  }

  return (
    <ThemeContext.Provider
      value={{isDark: isDarkTheme, switchTheme: switchTheme}}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
