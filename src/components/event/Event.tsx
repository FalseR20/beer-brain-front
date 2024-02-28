import {useParams} from "react-router-dom";
import Template from "../Template.tsx";
import {useEffect, useState} from "react";
import NotFound from "../NotFound.tsx";
import "../../css/Event.css";
import {CDetailedEvent} from "../../dataclasses.ts";
import {catchUnauthorized, FetchError, getDetailedEvent} from "../../fetches.tsx";
import {Badge, Button, Card, Col, ListGroup, Row} from "react-bootstrap";
import {UserAvatar} from "../user/UserAvatar.tsx";
import {BsGear} from "react-icons/bs";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../../urls.ts";
import {BALANCE_FORMAT, BANK_FORMAT} from "../../constants.ts";
import NewDepositModal from "./NewDepositModal.tsx";
import NewRepaymentModal from "./NewRepaymentModal.tsx";

export default function Event() {
  const [event, setEvent] = useState<CDetailedEvent>();
  const [is404, setIs404] = useState<boolean>(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showRepaymentModal, setShowRepaymentModal] = useState(false)

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
    {/* Event header */}
    <div className={"d-flex flex-row gap-3"}>
      <Card className={"flex-grow-1"}>
        <Card.Body className={"d-flex justify-content-between align-items-center px-3 py-2"}>
          <div>
            <Card.Title>
              {event.name}
            </Card.Title>
            <Card.Subtitle className={"text-muted"}>
              {event.description}
            </Card.Subtitle>
          </div>
          <div>
            <Card.Title className={"text-end"}>
              <span className={"fs-5 text-muted"}>Bank </span>
              <span className={"fs-2"}>{BANK_FORMAT.format(event.bank)}</span>
            </Card.Title>
            <Card.Subtitle className={"text-muted text-end"}>
              {event.date.toDateString()}
            </Card.Subtitle>
          </div>

        </Card.Body>
      </Card>
      <Button variant={"outline-secondary"}
              className={"d-flex justify-content-center align-items-center"}
      >
        <BsGear size={"2.5rem"}/>
      </Button>
    </div>


    <Row className={"m-0 my-3 gap-3"}>
      {/* Members card */}
      <Col className={"p-0"}>
        <Card>
          <Card.Header>
            Members
          </Card.Header>
          <ListGroup variant={"flush"}>
            {event.users.map((user) => (
              <ListGroup.Item key={user.username} action={true} className={"p-3"}
                              href={new UrlPattern(UrlsFront.EVENT_MEMBER).stringify({
                                "eventId": event.id,
                                "username": user.username
                              })}>
                <div className={"d-flex flex-row gap-3 align-items-center"}>
                  <div>
                    <UserAvatar user={user} round={true} size={"4rem"}/>
                    {user.deposits.length > 0 || user.repayments.length > 0 ? (<>
                      <Badge bg={"secondary"} pill style={{position: "absolute", left: "4rem"}}>
                        {user.deposits.length + user.repayments.length}
                      </Badge>
                    </>) : ""}
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
                  <div className={"flex-grow-1"}/>
                  <div className={"d-flex flex-column justify-content-center align-items-end"}>
                    <h3 className={`mb-0 ${user.balance < 0 ? "text-danger" : ""}`}>
                      {BALANCE_FORMAT.format(user.balance)}
                    </h3>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Col>
      {/* Deposits card */}
      <Col className={"p-0"}>
        <Card>
          <Card.Header>
            Deposits
          </Card.Header>
          <ListGroup variant={"flush"}>
            {event.deposits.map(deposit => (
              <ListGroup.Item action={true} key={deposit.id}>
                <div
                  className={"d-flex flex-row gap-2 justify-content-between align-items-center"}>
                  <UserAvatar user={deposit.user} round={true} size={"3rem"}/>
                  <div className={"d-flex flex-column justify-content-between flex-grow-1"}>
                    <span className={"fs-5"}>
                      {deposit.description}
                    </span>
                    <span className={"fs-6 text-muted"}>
                      {deposit.payedAt.toLocaleString()}
                    </span>
                  </div>
                  <span className={"fs-3"}>
                    {BANK_FORMAT.format(deposit.value)}
                  </span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
        <div className={"d-flex flex-row gap-3 my-3 justify-content-center"}>
          <Button variant={"primary"} onClick={() => setShowDepositModal(true)}>
            Add deposit
          </Button>
          <Button variant={"success"} onClick={() => setShowRepaymentModal(true)}>
            Add repayment
          </Button>

        </div>
      </Col>
    </Row>
    <NewDepositModal event={event} show={showDepositModal} setShow={setShowDepositModal}/>
    <NewRepaymentModal event={event} show={showRepaymentModal} setShow={setShowRepaymentModal}/>
  </Template>);
}
