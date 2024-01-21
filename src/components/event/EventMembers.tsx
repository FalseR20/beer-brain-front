import {IDetailedEvent} from "../../interfaces.ts";
import {ListGroup} from "react-bootstrap";
import {RxPlus} from "react-icons/rx";
import {UserAvatar} from "../user/UserAvatar.tsx";

export function EventMembers({event}: { event: IDetailedEvent }) {
  return <div className={"mb-1"}>
    <h5>
      {event.date}, {event.users.length} people
    </h5>
    <ListGroup horizontal={true}>
      {event.users.map((user) => <div key={user.username}>
        <UserAvatar user={user} size={"64"} round={true}/>
      </div>)}
      <div className={"m-2"}>
        <RxPlus size={48}/>
      </div>
    </ListGroup>
  </div>;
}