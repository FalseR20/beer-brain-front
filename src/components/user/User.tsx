import Template from "../Template.tsx";
import {CUser} from "../../dataclasses.ts";
import {useParams} from "react-router-dom";
import {getMyUser, getUser} from "../../fetches.tsx";
import {ReactNode, useEffect, useState} from "react";
import {UserAvatar} from "./UserAvatar.tsx";
import {Button, Card, ListGroup} from "react-bootstrap";


export default function User({me = false}: { me?: boolean }) {
  const [user, setUser] = useState<CUser>(
    {username: "", fullName: ""}
  );
  const params = useParams();
  const promise = me ? getMyUser() : getUser(params.username as string);
  useEffect(() => {
    promise.then(setUser)
  }, [promise]);

  return (<Template>
    <Card>
      <Card.Body>
        <UserTemplate user={user}/>
      </Card.Body>
    </Card>

    <h3 className={"mt-5 mb-2"}> Management </h3>
    <ListGroup className={"border rounded-2"} variant={"flush"}>
      <ListGroup.Item className={"d-flex flex-row align-items-center justify-content-between p-3"}>
        <span>Edit username and full name</span>
        <Button variant={"outline-secondary"} disabled={true}>Edit profile</Button>
      </ListGroup.Item>
    </ListGroup>

    <h3 className={"mt-4 mb-2"}> Danger Zone </h3>
    <ListGroup className={"border rounded-2 border-danger"} variant={"flush"}>
      <ListGroup.Item className={"d-flex flex-row align-items-center justify-content-between p-3"}>
        <span>Change password</span>
        <Button variant={"outline-danger"} disabled={true}>Change password</Button>
      </ListGroup.Item>
      <ListGroup.Item className={"d-flex flex-row align-items-center justify-content-between p-3"}>
        <div className={"d-flex flex-column"}>
          <span>Delete account</span>
          <span
            className={"text-muted"}>Delete your account and all its data with the events</span>
        </div>
        <Button variant={"outline-danger"} disabled={true}>Delete account</Button>
      </ListGroup.Item>
    </ListGroup>
  </Template>);
}


export function UserTemplate({user, children}: { user: CUser, children?: ReactNode }) {
  return <div className={"d-flex flex-row gap-3 align-items-center"}>
    <UserAvatar user={user} round={true} size={"4rem"}/>
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