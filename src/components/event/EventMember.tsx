import {lazy, useEffect, useState} from "react";
import {CDetailedEvent, CDetailedUser} from "../../dataclasses.ts";
import {Link, useParams} from "react-router-dom";
import {getEventMember} from "../../fetches.tsx";
import {Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {BsArrowLeft, BsCircle} from "react-icons/bs";
import {UserAvatar} from "../user/UserAvatar.tsx";
import {BALANCE_FORMAT, BANK_FORMAT} from "../../constants.ts";
import {FetchError} from "../../errors.ts";
import {make_front_url, UrlsFront} from "../../urls.ts";
import {useTranslation} from "react-i18next";
import useGuest from "../useGuest.tsx";
import ActionItem from "./ActionItem.tsx";

const NotFound = lazy(() => import("../NotFound.tsx"))
const Template = lazy(() => import("../template/Template.tsx"))

export default function EventMember() {
  const {t} = useTranslation();
  const [event, setEvent] = useState<CDetailedEvent>();
  const [user, setUser] = useState<CDetailedUser>();
  const [is404, setIs404] = useState<boolean>(false);
  const {redirectGuest} = useGuest()

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

  if (event == undefined || !user) {
    return is404 ? <NotFound/> : <Template/>;
  }
  const actions = user.getSortedActions();

  const userDiffBank = event.deposits.filter(d => !d.user.equals(user)).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0.0)
  const userDiff = -userDiffBank / event.users.length
  return <Template title={t("Event member title", {name: user.fullNameOrUsername})}>
    {/* Event member header */}
    <Card>
      <Card.Body className={"d-flex align-items-center px-3 py-2 gap-2"}>
        <Container fluid={true}>
          <Row className={"align-items-center gap-3"}>
            <Col xs={{span: "auto", order: 1}} md={{span: "auto", order: 1}} className={"p-0"}>
              <Link to={make_front_url(UrlsFront.EVENT, {eventId: event.id})}>
                <Button variant={"outline-secondary border-0"}>
                  <BsArrowLeft size={"2rem"}/>
                </Button>
              </Link>
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
          <Link to={make_front_url(UrlsFront.EVENT, {eventId: event.id})}>
            <Button variant={"outline-secondary border-0"}>
              <BsArrowLeft size={"2rem"}/>
            </Button>
          </Link>

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
      <Card.Header>{t("Actions")}</Card.Header>
      <ListGroup variant={"flush"}>
        {actions.map(action => (
          <ActionItem action_={action} event={event} user={user} hideRightUser={true}
                      key={action.id}/>
        ))}
      </ListGroup>
      <Card.Footer>
        <div className="d-flex align-items-center gap-3" style={{height: "3rem"}}>
          <div className={"d-flex align-items-center gap-2"}>
            <div style={{width: "2.8rem", height: "2.8rem"}} className={"d-none d-sm-block"}/>
            <BsCircle size={"1.8rem"}/>
            {/*<UserAvatar user={user} round={true} size={"3rem"}/>*/}
          </div>
          <div className={"d-flex flex-column flex-grow-1"}>
            <span className={"fst-italic"}>{t("The other deposits")}</span>
            {userDiff != 0.0 ? <div>
              <span className={"text-muted"}>{t("Difference: ")}</span>
              <span className={userDiff < 0 ? "text-danger" : "text-success"}>
            {BALANCE_FORMAT.format(userDiff)}
          </span>
            </div> : <></>}
          </div>

          {/*<span>{event.created_at.toLocaleString()}</span>*/}
          <h4 className={`mb-0`}>
            {BANK_FORMAT.format(userDiffBank)}
          </h4>
        </div>

      </Card.Footer>
    </Card>
  </Template>
    ;
}
