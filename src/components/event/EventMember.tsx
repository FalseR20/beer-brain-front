import Template from "../Template.tsx";
import {useEffect, useState} from "react";
import {CDeposit, CDetailedEvent, CDetailedUser, CRepayment} from "../../dataclasses.ts";
import {useParams} from "react-router-dom";
import {getEventMember, redirectGuest} from "../../fetches.tsx";
import NotFound from "../NotFound.tsx";
import {Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {
  BsArrowLeft,
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsCircle,
  BsPlusCircle
} from "react-icons/bs";
import {UserAvatar} from "../user/UserAvatar.tsx";
import {BALANCE_FORMAT} from "../../constants.ts";
import {FetchError} from "../../errors.ts";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../../urls.ts";

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
      <Card.Body className={"d-flex align-items-center px-3 py-2 gap-2"}>
        <Container fluid={true}>
          <Row className={"align-items-center gap-3"}>
            <Col xs={{span: "auto", order: 1}} md={{span: "auto", order: 1}} className={"p-0"}>
              <Button variant={"outline-secondary border-0"}
                      href={new UrlPattern(UrlsFront.EVENT).stringify({eventId: event.id})}>
                <BsArrowLeft size={"2rem"}/>
              </Button>
            </Col>
            <Col xs={{span: false, order: 3}} md={{span: true, order: 2}}>
              <Row className={"align-items-center flex-md-nowrap gap-2"}>
                <Col xs={"auto"} className={"p-0"}>
                  <div>
                    <UserAvatar user={user} round={true} size={"3.5rem"}/>
                  </div>
                </Col>
                <Col xs={"auto"} className={"p-0"}>
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
                </Col>
                <Col xs={"auto"} className={"p-0 ms-auto me-md-auto"}>
                  <h3 className={`mb-0 ${user.balance < 0 ? "text-danger" : ""}`}>
                    {BALANCE_FORMAT.format(user.balance)}
                  </h3>
                </Col>
              </Row>
            </Col>
            <Col xs={{span: true, order: 2}} md={{span: "auto", order: 3}}
                 className={"p-0 text-md-end"}>
              <Card.Title>
                {event.name}
              </Card.Title>
              <Card.Subtitle className={"text-muted"}>
                {event.description}
              </Card.Subtitle>
            </Col>
          </Row>
        </Container>
        <div style={{display: "none"}}>
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
        </div>
      </Card.Body>
    </Card>

    {/* Actions */}
    <Card className={"mt-3"}>
      <Card.Header>Actions</Card.Header>
      <ListGroup variant={"flush"}>
        {actions.map(action => (
          <ListGroup.Item key={action.id} action={true}
                          className={"d-flex flex-row align-items-center gap-3"}
                          href={action.makeFrontHref()}>
            {action instanceof CDeposit ? (<div className={"d-flex align-items-center gap-2"}>
              <div style={{width: "3rem", height: "3rem"}}/>
              <BsPlusCircle size={"1.5rem"}/>
              {/*<UserAvatar user={action.user} round={true} size={"3rem"}/>*/}
            </div>) : (action.payer.equals(user)) ? (
              <div className={"d-flex align-items-center gap-2"}>
                <UserAvatar user={action.recipient} round={true} size={"3rem"}/>
                <BsArrowLeftCircle size={"1.5rem"}/>
                {/*<UserAvatar user={action.payer} round={true} size={"3rem"}/>*/}
              </div>) : (<div className={"d-flex align-items-center gap-2"}>
              <UserAvatar user={action.payer} round={true} size={"3rem"}/>
              <BsArrowRightCircle size={"1.5rem"}/>
              {/*<UserAvatar user={action.recipient} round={true} size={"3rem"}/>*/}
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
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Card.Footer>
        <div className="d-flex align-items-center gap-3" style={{height: "3rem"}}>
          <div className={"d-flex align-items-center gap-2"}>
            <div style={{width: "3rem", height: "3rem"}}/>
            <BsCircle size={"1.5rem"}/>
            {/*<UserAvatar user={user} round={true} size={"3rem"}/>*/}
          </div>
          <span className={"fst-italic flex-grow-1"}>Event debt</span>
          {/*<span>{event.created_at.toLocaleString()}</span>*/}
          <h4 className={`mb-0 text-danger`}>
            {BALANCE_FORMAT.format(-event.bankPart)}
          </h4>
        </div>

      </Card.Footer>
    </Card>
  </Template>;
}