import React, {createContext, useState} from "react";


export const ThemeContext = createContext({
  isDark: true,
  switchTheme: (): void => {
  },
});

export default function ThemeContextWrapper(props: {
  children: React.ReactNode;
}) {
  const [isDarkTheme, changeIsDarkTheme] = useState(
    localStorage.getItem("theme") != "ligh",
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
