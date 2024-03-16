import {Button, Form, InputGroup, Offcanvas} from "react-bootstrap";
import {signOut} from "../../fetches.tsx";
import {useState} from "react";
import {CUser} from "../../dataclasses.ts";
import {UserAvatar} from "../user/UserAvatar.tsx";
import {UserTemplate} from "../user/User.tsx";
import {UrlsFront} from "../../urls.ts";
import UrlPattern from "url-pattern";
import {BsBoxArrowRight, BsPerson} from "react-icons/bs";
import {useTranslation} from "react-i18next";
import {supportedLngs} from "../../i18n/config.ts";


export function AvatarOffcanvas({user}: { user?: CUser }) {
  const [show, setShow] = useState(false)
  const {t, i18n} = useTranslation();
  const iconsSize = "1.5rem"
  return (
    <>
      <UserAvatar user={user} size={"3.15rem"} round={true}
                  className={"hover-cursor-pointer"}
                  onClick={() => setShow(true)}/>

      <Offcanvas placement="end" show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton={true} className={"border-bottom"}>
          <UserTemplate user={user!}/>
        </Offcanvas.Header>
        <Offcanvas.Body className={"d-flex flex-column gap-3"}>
          <Button variant="outline-secondary" className={"text-reset border-light-subtle"}
                  href={!user ? "" : new UrlPattern(UrlsFront.USER).stringify({username: user.username})}>
            <span className={"d-flex align-items-center gap-1"}>
            <BsPerson size={iconsSize}/>&nbsp;{t("Profile")}
            </span>
          </Button>
          <Form.Group controlId="language">
            <Form.Label>{t("Language")}</Form.Label>
            <InputGroup hasValidation>
              <Form.Select value={i18n.resolvedLanguage}
                           onChange={e => i18n.changeLanguage(e.target.value)}>
                {Object.entries(supportedLngs).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
          <Button variant={"outline-secondary"} className={"border-0 mt-3"}
                  onClick={() => signOut().then(() => window.location.replace("/"))}>
            <span className={"d-flex align-items-center gap-1"}>
            <BsBoxArrowRight size={iconsSize}/>&nbsp;{t("Sign Out")}
            </span>
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
