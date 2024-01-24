import {Navbar} from "react-bootstrap";
import {ThemeSwitcher} from "./ThemeSwitcher.tsx";
import {SignGroup} from "./SignGroup.tsx";
import {UrlsFront} from "../../urls.ts";

export default function Header() {
  return (
    <header className="d-flex flex-row justify-content-center bg-body-tertiary border-bottom">
      <Navbar
        className={
          "width-60 mx-3 d-flex flex-row justify-content-between align-items-center"
        }
      >
        <Navbar.Brand href={UrlsFront.HOME} className={"fs-3"}>
          BeerBrain
        </Navbar.Brand>
        <Navbar.Collapse className={"justify-content-end"}>
          <SignGroup/>
          <ThemeSwitcher/>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

