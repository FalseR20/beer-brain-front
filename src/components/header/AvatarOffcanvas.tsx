import {Button, Offcanvas} from "react-bootstrap";
import {signOut} from "../../fetches.tsx";
import {useState} from "react";
import {CUser} from "../../dataclasses.ts";
import {UserAvatar} from "../user/UserAvatar.tsx";
import {UserTemplate} from "../user/User.tsx";
import {UrlsFront} from "../../urls.ts";
import UrlPattern from "url-pattern";
import {BsBoxArrowRight, BsPerson} from "react-icons/bs";


export function AvatarOffcanvas({user}: { user?: CUser }) {
  const [show, setShow] = useState(false)
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
        <Offcanvas.Body className={"d-flex flex-column gap-2"}>
          <Button variant="outline-secondary" className={"text-start"}
                  href={!user ? "" : new UrlPattern(UrlsFront.USER).stringify({username: user.username})}>
            <span className={"d-flex align-items-center gap-1"}>
            <BsPerson size={iconsSize}/>&nbsp;Profile
            </span>
          </Button>
          {/*<Button variant="outline-secondary" className={"text-start"}*/}
          {/*        href={UrlsFront.SETTINGS}>*/}
          {/*  <span className={"d-flex align-items-center gap-1"}>*/}
          {/*  <BsGear size={iconsSize}/>&nbsp;Settings*/}
          {/*  </span>*/}
          {/*</Button>*/}
          <br/>
          <Button variant={"outline-secondary"} className={"border-0 text-start"}
                  onClick={() => signOut().then(() => window.location.replace("/"))}>
            <span className={"d-flex align-items-center gap-1"}>
            <BsBoxArrowRight size={iconsSize}/>&nbsp;Sign Out
            </span>
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
