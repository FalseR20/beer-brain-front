import Template from "../Template.tsx";
import {useEffect, useState} from "react";
import {CDeposit, CDetailedEvent, CDetailedUser, CRepayment} from "../../dataclasses.ts";
import {useParams} from "react-router-dom";
import {redirectGuest, getEventMember} from "../../fetches.tsx";
import NotFound from "../NotFound.tsx";
import {Button, Card, ListGroup} from "react-bootstrap";
import {
  BsArrowDownCircle,
  BsArrowLeft,
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsArrowUpCircle
} from "react-icons/bs";
import {UrlsFront} from "../../urls.ts";
import UrlPattern from "url-pattern";
import {UserAvatar} from "../user/UserAvatar.tsx";
import {BALANCE_FORMAT} from "../../constants.ts";
import {FetchError} from "../../errors.ts";

export default function EventMember() {
  const [event, setEvent] = useState<CDetailedEvent>();
  const [user, setUser] = useState<CDetailedUser>();
  const [is404, setIs404] = useState<boolean>(false);

  const params = useParams<{ eventId: string, username: string }>();
  useEffect(() => {
    getEventMember(params.eventId!, params.username!)
      .then((data) => {
        setUser(data.user);
        setEvent(data.detailedEvent);
      })
      .catch((error: FetchError) => {
        redirectGuest(error);
        if (error.status == 404) {
          setIs404(true);
        }
      });
  }, [params.eventId, params.username]);

  if (event == undefined) {
    return is404 ? <NotFound/> : <Template/>;
  }
  return render(event, user!);
}

function render(event: CDetailedEvent, user: CDetailedUser) {
  const actions = user.getSortedActions();
  return <Template title={`member - ${user.fullNameOrUsername}`}>
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
    <Card className={"mt-3"}>
      <Card.Header>Actions</Card.Header>
      <ListGroup variant={"flush"}>
        {actions.map(action => (<ListGroup.Item key={action.id}
                                                className={"d-flex flex-row align-items-center gap-3"}>
          {action instanceof CDeposit ? (<div className={"d-flex align-items-center gap-2"}>
            <div style={{width: "3rem", height: "3rem"}}/>
            <BsArrowUpCircle size={"1.5rem"}/>
            <UserAvatar user={action.user} round={true} size={"3rem"}/>
          </div>) : (action.payer.equals(user)) ? (
            <div className={"d-flex align-items-center gap-2"}>
              <UserAvatar user={action.recipient} round={true} size={"3rem"}/>
              <BsArrowLeftCircle size={"1.5rem"}/>
              <UserAvatar user={action.payer} round={true} size={"3rem"}/>
            </div>) : (<div className={"d-flex align-items-center gap-2"}>
            <UserAvatar user={action.payer} round={true} size={"3rem"}/>
            <BsArrowRightCircle size={"1.5rem"}/>
            <UserAvatar user={action.recipient} round={true} size={"3rem"}/>
          </div>)}
          <div className={"d-flex flex-column flex-grow-1"}>
            <span>{action.description}</span>
            <span>{action.payedAt.toLocaleString()}</span>
          </div>
          {(action instanceof CRepayment && action.recipient.equals(user)) ? (
            <h4 className={`mb-0 text-danger`}>
              {BALANCE_FORMAT.format(-action.value)}
            </h4>) : (<h4 className={"m-0"}>
            {BALANCE_FORMAT.format(action.value)}
          </h4>)}
        </ListGroup.Item>))}
      </ListGroup>
      <Card.Footer>
        <div className="d-flex align-items-center gap-3" style={{height: "3rem"}}>
          <div className={"d-flex align-items-center gap-2"}>
            <div style={{width: "3rem", height: "3rem"}}/>
            <BsArrowDownCircle size={"1.5rem"}/>
            <UserAvatar user={user} round={true} size={"3rem"}/>
          </div>
          <div className={"d-flex flex-column flex-grow-1"}>
            <span><i>Event debt</i></span>
            <span>{event.created_at.toLocaleString()}</span>
          </div>
          <h4 className={`mb-0 text-danger`}>
            {BALANCE_FORMAT.format(-event.bankPart)}
          </h4>
        </div>

      </Card.Footer>
    </Card>
  </Template>;
}