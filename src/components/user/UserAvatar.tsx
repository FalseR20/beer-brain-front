import Avatar, {ReactAvatarProps} from "react-avatar";
import {IUser} from "../../interfaces.ts";


export interface UserAvatarProps extends ReactAvatarProps {
  user: IUser,
}

export function UserAvatar(props: UserAvatarProps) {
  return <Avatar name={props.user.full_name || props.user.username} {...props}/>
}

export function LinkUserAvatar(props: UserAvatarProps) {
  const onClick = () => window.location.href = `/users/id/${props.user.username}`;
  return <UserAvatar onClick={onClick} className={"hover-cursor-pointer"} {...props}/>
}
