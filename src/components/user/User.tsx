import Template from "../Template.tsx";
import {IUser} from "../../interfaces.ts";
import {useParams} from "react-router-dom";
import {getUser} from "../../fetches.tsx";
import {useEffect, useState} from "react";
import {LinkUserAvatar} from "./UserAvatar.tsx";


export default function User() {
  const [user, setUser] = useState<IUser>(
    {username: "", full_name: ""}
  );
  const username = useParams().username as string;
  useEffect(() => {
    getUser(username).then(setUser)
  }, [username]);

  return (<Template>
    <h1>{user.full_name || user.username}</h1>
    <LinkUserAvatar user={user} round={true}/>
    <div className={"d-flex flex-row gap-2"}>
    </div>
  </Template>);
}

