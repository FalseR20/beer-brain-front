import {Button, Navbar} from "react-bootstrap";
import {ThemeSwitcher} from "./ThemeSwitcher.tsx";
import {AvatarOffcanvas} from "./AvatarOffcanvas.tsx";
import {UrlsFront} from "../../urls.ts";
import {useContext} from "react";
import {AuthContext} from "../../contexts/authContext.tsx";
import {CUser} from "../../dataclasses.ts";
import {useTranslation} from "react-i18next";

export default function Header() {
  const user = useContext(AuthContext)
  const {t} = useTranslation()
  return (
    <header className="d-flex flex-row justify-content-center bg-body-tertiary border-bottom">
      <Navbar
        className={"width-60 mx-3 d-flex flex-row align-items-center"}>
        <Navbar.Brand href={UrlsFront.HOME} className={"fs-3"}>
          {t("Brand")}
        </Navbar.Brand>
        <div className={"justify-content-end d-flex gap-3 align-items-center flex-grow-1"}>
          <ThemeSwitcher/>
          {(user instanceof CUser || user === undefined) ? (
            <AvatarOffcanvas user={user}/>
          ) : (
            <>
              <Button variant={"outline-success"} href={UrlsFront.SIGN_IN}>
                {t("Sign In")}
              </Button>
              <Button variant={"success"} href={UrlsFront.SIGN_UP}>
                {t("Sign Up")}
              </Button>
            </>
          )}
        </div>
      </Navbar>
    </header>
  );
}
