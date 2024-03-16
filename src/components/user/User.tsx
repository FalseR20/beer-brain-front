import Template from "../Template.tsx";
import {CUser} from "../../dataclasses.ts";
import {useParams, useSearchParams} from "react-router-dom";
import {getUser} from "../../fetches.tsx";
import {ReactNode, useContext, useEffect, useState} from "react";
import {UserAvatar} from "./UserAvatar.tsx";
import {Alert, Button, Card, ListGroup} from "react-bootstrap";
import {AuthContext} from "../../contexts/authContext.tsx";
import {make_front_url, UrlsFront} from "../../urls.ts";
import {UserPropsModal} from "./UserPropsModal.tsx";
import {BsCheckCircle} from "react-icons/bs";
import {useTranslation} from "react-i18next";


export default function User() {
  const {t} = useTranslation();
  const [user, setUser] = useState<CUser>(new CUser());
  const [showPropsModal, setShowPropsModal] = useState(false);
  const params = useParams<{ username: string }>();
  const me = useContext(AuthContext)
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPasswordChanged, setShowPasswordChanged] = useState(false);
  useEffect(() => {
    if (!params.username) {
      if (me) {
        window.location.href = make_front_url(UrlsFront.USER, {username: me.username});
      }
    } else {
      getUser(params.username).then(setUser)
    }
  }, [me, params.username]);
  useEffect(() => {
    if (searchParams.has("showPasswordChanged") && !showPasswordChanged) {
      setShowPasswordChanged(true);
      setSearchParams("")
    }
  }, [showPasswordChanged, searchParams, setSearchParams]);
  const isMe = me?.equals(user) || false

  return (<Template title={`${user.fullNameOrUsername}`}>
    <Card>
      <Card.Body>
        <UserTemplate user={user}/>
      </Card.Body>
    </Card>
    {!isMe ? "" : (
      <>
        <Alert variant={"success"} className={"mt-3"} show={showPasswordChanged} onClose={() => setShowPasswordChanged(false)} dismissible>
          <Alert.Heading className={"d-flex flex-row align-items-center gap-3 mb-2"}>
            <BsCheckCircle size={"1.8rem"}/>
            {t("Password changed title")}
          </Alert.Heading>
          <p>{t("Password changed description")}</p>
        </Alert>

        <h3 className={"mt-3 mb-2"}>{t("Management")}</h3>
        <ListGroup className={"border rounded-2"} variant={"flush"}>
          <ListGroup.Item
            className={"d-flex flex-row align-items-center justify-content-between gap-2 p-3"}>
            <span>{t("Update user title")}</span>
            <Button variant={"secondary"} onClick={() => setShowPropsModal(true)}>
              {t("Update user")}
            </Button>
          </ListGroup.Item>
        </ListGroup>

        <h3 className={"mt-4 mb-2"}>{t("Danger Zone")}</h3>
        <ListGroup className={"border rounded-2 border-danger"} variant={"flush"}>
          <ListGroup.Item
            className={"d-flex flex-row align-items-center justify-content-between gap-2 p-3"}>
            <div className={"d-flex flex-column"}>
              <span>{t("Change password description")}</span>
              <span className={"text-muted"}>{t("Change password muted")}</span>
            </div>
            <Button variant={"outline-danger"} href={UrlsFront.CHANGE_PASSWORD}>{t("Change password")}</Button>
          </ListGroup.Item>
          <ListGroup.Item
            className={"d-flex flex-row align-items-center justify-content-between gap-2 p-3"}>
            <div className={"d-flex flex-column"}>
              <span>{t("Delete account description")}</span>
              <span className={"text-muted"}>{t("Delete account muted")}</span>
              <span className={"text-danger-emphasis"}>{t("Delete account red")}</span>
            </div>
            <Button variant={"outline-danger"} disabled={true}>{t("Delete account")}</Button>
          </ListGroup.Item>
        </ListGroup>
        <UserPropsModal user={user} show={showPropsModal} setShow={setShowPropsModal}/>
      </>
    )}
  </Template>);
}


export function UserTemplate({user, children, size}: {
  user: CUser,
  children?: ReactNode,
  size?: string
}) {
  return <div className={"d-flex flex-row gap-3 align-items-center"}>
    <UserAvatar user={user} round={true} size={size || "4rem"}/>
    <div className={"d-flex flex-column justify-content-center flex-grow-1"}>
      <Card.Title>
        {`@${user.username}`}
      </Card.Title>
      {user.fullName == "" ? "" : <>
        <Card.Subtitle className={"text-muted"}>{user.fullName}</Card.Subtitle>
      </>}
    </div>
    {children}
  </div>
}
