import Template from "../Template.tsx";
import {CUser} from "../../dataclasses.ts";
import {useParams} from "react-router-dom";
import {getUser} from "../../fetches.tsx";
import {ReactNode, useContext, useEffect, useState} from "react";
import {UserAvatar} from "./UserAvatar.tsx";
import {Button, Card, ListGroup} from "react-bootstrap";
import {AuthContext} from "../../contexts/authContext.tsx";
import {make_front_url, UrlsFront} from "../../urls.ts";
import {UserPropsModal} from "./UserPropsModal.tsx";


export default function User() {
  const [user, setUser] = useState<CUser>(new CUser());
  const [showPropsModal, setShowPropsModal] = useState(false);
  const params = useParams<{ username: string }>();
  const me = useContext(AuthContext)
  useEffect(() => {
    if (!params.username) {
      if (me) {
        window.location.href = make_front_url(UrlsFront.USER, {username: me.username});
      }
    } else {
      getUser(params.username).then(setUser)
    }
  }, [me, params.username]);
  const isMe = me?.equals(user) || false

  return (<Template title={`${user.fullNameOrUsername}`}>
    <Card>
      <Card.Body>
        <UserTemplate user={user}/>
      </Card.Body>
    </Card>
    {!isMe ? "" : (
      <>
        <h3 className={"mt-5 mb-2"}> Management </h3>
        <ListGroup className={"border rounded-2"} variant={"flush"}>
          <ListGroup.Item
            className={"d-flex flex-row align-items-center justify-content-between p-3"}>
            <span>Edit username and full name</span>
            <Button variant={"secondary"} onClick={() => setShowPropsModal(true)}>Edit
              profile</Button>
          </ListGroup.Item>
        </ListGroup>

        <h3 className={"mt-4 mb-2"}> Danger </h3>
        <ListGroup className={"border rounded-2 border-danger"} variant={"flush"}>
          <ListGroup.Item
            className={"d-flex flex-row align-items-center justify-content-between p-3"}>
            <div className={"d-flex flex-column"}>
              <span>Change password</span>
              <span className={"text-muted"}>You will need to enter your old password</span>
            </div>
            <Button variant={"outline-danger"} disabled={true}>Change password</Button>
          </ListGroup.Item>
          <ListGroup.Item
            className={"d-flex flex-row align-items-center justify-content-between p-3"}>
            <div className={"d-flex flex-column"}>
              <span>Delete account</span>
              <span className={"text-muted"}>Delete your account and all its data</span>
            </div>
            <Button variant={"outline-danger"} disabled={true}>Delete account</Button>
          </ListGroup.Item>
        </ListGroup>
        <UserPropsModal user={user} show={showPropsModal} setShow={setShowPropsModal}/>
      </>
    )}
  </Template>);
}


export function UserTemplate({user, children, size}: { user: CUser, children?: ReactNode, size?: string }) {
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
