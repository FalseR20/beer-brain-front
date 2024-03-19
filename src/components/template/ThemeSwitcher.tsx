import {ThemeContext} from "../../contexts/themeContext.tsx";
import {BsMoon, BsSun} from "react-icons/bs";

export function ThemeSwitcher() {
  return (
    <ThemeContext.Consumer>
      {({isDark, switchTheme}) => (
        <a
          className={"fs-2 text-body pb-2 hover-cursor-pointer"}
          onClick={switchTheme}
        >
          {isDark ? <BsSun/> : <BsMoon/>}
        </a>
      )}
    </ThemeContext.Consumer>
  );
}