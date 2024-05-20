import {BsBell} from "react-icons/bs";
import {Badge, Button} from "react-bootstrap";

export default function Notifications() {
  const nNotifications = 10;
  return <>
    <Button variant={"outline-secondary"} className={"fs-3 text-body p-2 border-0 pb-2"}>
      {nNotifications > 0 && (
        <div className={"fs-6"}>
          <Badge bg={"danger"} pill style={{position: "absolute", right: "4.4rem", top: "0.8rem"}}>
            {nNotifications > 99 ? ">99" : nNotifications}
          </Badge>
        </div>
      )}
      <BsBell/>
    </Button>
  </>
}
