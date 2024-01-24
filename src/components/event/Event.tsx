import {useParams} from "react-router-dom";
import Template from "../Template.tsx";
import {useEffect, useState} from "react";
import NotFound from "../NotFound.tsx";
import "../../css/Event.css";
import {IDetailedEvent} from "../../interfaces.ts";
import {catchUnauthorized, FetchError, getDetailedEvent} from "../../fetches.tsx";
import {Card, ListGroup} from "react-bootstrap";
import {UserTemplate} from "../user/User.tsx";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../../urls.ts";

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
        {event.users.map((user) => <>
          <ListGroup.Item action={true} className={"p-3"} onClick={() => {
            window.location.href = new UrlPattern(UrlsFront.EVENT_ACTION).stringify({
              "eventId": event.id,
              "username": user.username
            })
          }}>
            <UserTemplate user={user}>
              {`${user.deposits.length} deposits, ${user.repayments.length} repayments`}
            </UserTemplate>
          </ListGroup.Item>
        </>)}
      </ListGroup>
    </Card>
  </Template>);
}
