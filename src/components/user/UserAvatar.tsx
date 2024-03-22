import Avatar, {ReactAvatarProps} from "react-avatar";
import {CUser} from "../../dataclasses.ts";
import {make_front_url, UrlsFront} from "../../urls.ts";
import {useNavigate} from "react-router-dom";


export interface UserAvatarProps extends ReactAvatarProps {
  user: CUser,
}

export function UserAvatar(props: Partial<UserAvatarProps>) {
  if (!props.user) {
    return <div style={{width: props.size, height: props.size}}/>
  }
  return <Avatar name={props.user.fullNameOrUsername} {...props}/>
}

export function LinkUserAvatar(props: UserAvatarProps) {
  const navigate = useNavigate();
  const onClick = () => navigate(make_front_url(UrlsFront.USER, {"username": props.user.username}))
  return <UserAvatar onClick={onClick} className={"hover-cursor-pointer"} {...props}/>
}
