import Template from "../Template.tsx";
import {useEffect, useState} from "react";
import {CDetailedEvent, CDetailedUser} from "../../dataclasses.ts";
import {useParams} from "react-router-dom";
import {catchUnauthorized, FetchError, getDetailedEvent, getDetailedUser} from "../../fetches.tsx";
import NotFound from "../NotFound.tsx";
import {Button, Card} from "react-bootstrap";
import {BsArrowLeft} from "react-icons/bs";
import {UrlsFront} from "../../urls.ts";
import UrlPattern from "url-pattern";
import {UserAvatar} from "../user/UserAvatar.tsx";
import {BALANCE_FORMAT} from "../../constants.ts";

export default function EventMember() {
  const [event, setEvent] = useState<CDetailedEvent>();
  const [user, setUser] = useState<CDetailedUser>()
  const [is404, setIs404] = useState<boolean>(false)

  const params = useParams<{ eventId: string, username: string }>();
  useEffect(() => {
    getDetailedEvent(params.eventId!)
      .then(event_ => {
        setUser(event_.users.find(user => user.username === params.username!))
        setEvent(event_)
      })
      .catch(async (reason: FetchError) => {
        const error = await catchUnauthorized(reason)
        if (error.status == 404) {
          setIs404(true)
        }
      })
  }, [params.eventId, params.username]);

  useEffect(() => {
    getDetailedUser(params.eventId!, params.username!)
      .then(setUser)
      .catch(async (reason: FetchError) => {
        const error = await catchUnauthorized(reason)
        if (error.status == 404) {
          setIs404(true)
        }
      })
  }, [params]);

  if (event == undefined) {
    return is404 ? <NotFound/> : <Template/>;
  }
  if (user == undefined) {
    return <NotFound/>;
  }
  return render(event, user)
}

function render(event: CDetailedEvent, user: CDetailedUser) {
  // const actions = user.getSortedActions()
  return <Template>
    {/* Event member header */}
    <Card>
      <Card.Body className={"d-flex align-items-center px-3 py-2 gap-3"}>
        <Button variant={"outline-secondary border-0"}
                href={new UrlPattern(UrlsFront.EVENT).stringify({eventId: event.id})}>
          <BsArrowLeft size={"2rem"}/>
        </Button>
        <div>
          <UserAvatar user={user} round={true} size={"3.5rem"}/>
        </div>
        <div className={"d-flex flex-column justify-content-center"}>
          <Card.Title className={"mb-0"}
                      style={event.host.username == user.username ? {color: "goldenrod"} : {}}>
            {`@${user.username}`}
          </Card.Title>
          {user.fullName == "" ? "" : <>
            <Card.Subtitle
              className={"text-muted mt-1"}>{user.fullName}</Card.Subtitle>
          </>}
        </div>
        <div className={"flex-grow-1 d-flex justify-content-center align-items-center"}>
          <h3 className={`mb-0 ${user.balance < 0 ? "text-danger" : ""}`}>
            {BALANCE_FORMAT.format(user.balance)}
          </h3>
        </div>
        <div>
          <Card.Title className={"text-end"}>
            {event.name}
          </Card.Title>
          <Card.Subtitle className={"text-muted text-end"}>
            {event.description}
          </Card.Subtitle>
        </div>
      </Card.Body>
    </Card>

    {/* Actions */}
    {/*<Card className={"mt-3"}>*/}
    {/*  <Card.Header>Actions</Card.Header>*/}
    {/*  <Card.Body>*/}
    {/*    /!*{actions.map(action => {*!/*/}
    {/*    /!*  if (action )*!/*/}
    {/*    /!*})}*!/*/}
    {/*  </Card.Body>*/}
    {/*  <Card.Footer>Debt of event</Card.Footer>*/}
    {/*</Card>*/}
  </Template>
}