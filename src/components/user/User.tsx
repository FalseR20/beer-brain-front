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


export default function User() {
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
            Password changed successfully
          </Alert.Heading>
          <p>Agree with your browser password manager to change it</p>
        </Alert>

        <h3 className={"mt-3 mb-2"}> Management </h3>
        <ListGroup className={"border rounded-2"} variant={"flush"}>
          <ListGroup.Item
            className={"d-flex flex-row align-items-center justify-content-between gap-2 p-3"}>
            <span>Edit username and full name</span>
            <Button variant={"secondary"} onClick={() => setShowPropsModal(true)}>Edit
              profile</Button>
          </ListGroup.Item>
        </ListGroup>

        <h3 className={"mt-4 mb-2"}> Danger </h3>
        <ListGroup className={"border rounded-2 border-danger"} variant={"flush"}>
          <ListGroup.Item
            className={"d-flex flex-row align-items-center justify-content-between gap-2 p-3"}>
            <div className={"d-flex flex-column"}>
              <span>Change password</span>
              <span className={"text-muted"}>You will need to enter your old password</span>
            </div>
            <Button variant={"outline-danger"} href={UrlsFront.CHANGE_PASSWORD}>
              Change password
            </Button>
          </ListGroup.Item>
          <ListGroup.Item
            className={"d-flex flex-row align-items-center justify-content-between gap-2 p-3"}>
            <div className={"d-flex flex-column"}>
              <span>Delete account</span>
              <span className={"text-muted"}>Delete your account and all its data</span>
              <span className={"text-danger-emphasis"}>Don't even think!</span>
            </div>
            <Button variant={"outline-danger"} disabled={true}>Delete account</Button>
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
