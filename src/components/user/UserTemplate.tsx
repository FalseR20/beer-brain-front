import {CUser} from "../../dataclasses.ts";
import {ReactNode} from "react";
import {UserAvatar} from "./UserAvatar.tsx";
import {Card} from "react-bootstrap";

export default function UserTemplate({user, children, size}: {
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