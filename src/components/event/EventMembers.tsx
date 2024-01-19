import {IDetailedEvent} from "../../interfaces.ts";
import {ListGroup} from "react-bootstrap";
import {Avatar48} from "../Profile.tsx";
import {RxPlus} from "react-icons/rx";

export function EventMembers({event}: { event: IDetailedEvent }) {
  return <div className={"mb-1"}>
    <h5>
      {event.date}, {event.users.length} people
    </h5>
    <ListGroup horizontal={true}>
      {event.users.map((user) => <div key={user.username}>
        <Avatar48 username={user.username}/>
      </div>)}
      <div className={"m-2"}>
        <RxPlus size={48}/>
      </div>
    </ListGroup>
  </div>;
}