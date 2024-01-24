import {useParams} from "react-router-dom";
import Template from "../Template.tsx";
import {useEffect, useState} from "react";
import NotFound from "../NotFound.tsx";
import "../../css/Event.css";
import {IDetailedEvent} from "../../interfaces.ts";
import {catchUnauthorized, FetchError, getDetailedEvent} from "../../fetches.tsx";
import {Badge, Card, ListGroup} from "react-bootstrap";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../../urls.ts";
import {UserAvatar} from "../user/UserAvatar.tsx";

export default function Event() {
  const [event, setEvent] = useState<IDetailedEvent>();
  const [is404, setIs404] = useState<boolean>(false)

  const params = useParams<{ eventId: string }>();
  useEffect(() => {
    getDetailedEvent(params.eventId!)
      .then(setEvent)
      .catch(async (reason: FetchError) => {
        const error = await catchUnauthorized(reason)
        if (error.status == 404) {
          setIs404(true)
        }
      })
  }, [params.eventId]);

  if (event == undefined) {
    return is404 ? <NotFound/> : <Template/>;
  }

  event.users.sort((a, b) => a.balance - b.balance)
  const balanceFormat = new Intl.NumberFormat("en-us", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  })
  return (<Template>
    <Card>
      <Card.Body>
        <Card.Title>
          {event.name}
        </Card.Title>
        <Card.Subtitle className={"text-muted"}>
          {event.description}
        </Card.Subtitle>
      </Card.Body>
    </Card>

    <Card className={"mt-3"}>
      <Card.Header>
        Members
      </Card.Header>
      <ListGroup variant={"flush"}>
        {event.users.map((user) => (
          <ListGroup.Item key={user.username} action={true} className={"p-3"} onClick={() => {
            window.location.href = new UrlPattern(UrlsFront.EVENT_ACTION).stringify({
              "eventId": event.id,
              "username": user.username
            })
          }}>
            <div className={"d-flex flex-row gap-3 align-items-center"}>
              <UserAvatar user={user} round={true} size={"4rem"}/>
              <div className={"d-flex flex-column justify-content-center flex-grow-1"}>
                <Card.Title className={"mb-0"}>
                  {`@${user.username} `}
                  {!user.deposits.length ? "" : <>
                    <Badge bg={"success"}>
                      {`${user.deposits.length} deposits`}
                    </Badge>
                    {""}
                  </>}
                  {!user.repayments.length ? "" : <>
                    <Badge bg={"secondary"}>
                      {`${user.repayments.length} repayments`}
                    </Badge>
                  </>}
                </Card.Title>
                {user.full_name == "" ? "" : <>
                  <Card.Subtitle className={"text-muted mt-1"}>{user.full_name}</Card.Subtitle>
                </>}
              </div>
              <h2 className={user.balance > 0 ? "" : "text-danger"}>
                {balanceFormat.format(user.balance)}
              </h2>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  </Template>);
}
