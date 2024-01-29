import Avatar, {ReactAvatarProps} from "react-avatar";
import {IUser} from "../../interfaces.ts";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../../urls.ts";


export interface UserAvatarProps extends ReactAvatarProps {
  user: IUser,
}

export function UserAvatar(props: UserAvatarProps) {
  return <Avatar name={props.user.fullName || props.user.username} {...props}/>
}

export function LinkUserAvatar(props: UserAvatarProps) {
  const onClick = () => window.location.href = new UrlPattern(UrlsFront.USER).stringify({"username": props.user.username});
  return <UserAvatar onClick={onClick} className={"hover-cursor-pointer"} {...props}/>
}
