import Template from "../Template.tsx";
import {useState} from "react";
import NotFound from "../NotFound.tsx";
import "../../css/Event.css";
import {Badge, Button, Card, Col, ListGroup, Row} from "react-bootstrap";
import {UserAvatar} from "../user/UserAvatar.tsx";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../../urls.ts";
import {BALANCE_FORMAT, BANK_FORMAT} from "../../constants.ts";
import NewDepositModal from "./NewDepositModal.tsx";
import NewRepaymentModal from "./NewRepaymentModal.tsx";
import {BsArrowDown, BsArrowLeftRight, BsGear} from "react-icons/bs";
import {useDetailedEvent} from "./UseDetailedEvent.tsx";

export default function Event() {
  const {event, is404} = useDetailedEvent()
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showRepaymentModal, setShowRepaymentModal] = useState(false)

  if (event == undefined) {
    return is404 ? <NotFound/> : <Template/>;
  }

  return (<Template title={`event - ${event.name}`}>
    <div id={"event-header"}>
      <div id={"event-header-top"}
           className={"border-bottom color-border-muted pb-3 d-flex justify-content-between"}>
        <div className={"d-flex flex-column"}>
          <span className={"fs-4 fw-bold"}>
            {event.name}
          </span>
          <span className={"fs-6"}>
            {event.description}
          </span>
        </div>
        <div className={"d-flex flex-column align-items-end"}>
          <span className={"fw-bold fs-4"}>
            <span className={"text-muted"}>Bank </span>
            {BANK_FORMAT.format(event.bank)}
            </span>
          <span className={"fs-6"}>
            {BANK_FORMAT.format(event.bankPart)}
            <span className={"text-muted"}> each</span>
          </span>
        </div>
      </div>
      <div id={"event-header-bottom"}
           className={"py-3 d-flex flex-row justify-content-between gap-3"}>
        <div className={"d-flex flex-row gap-3 justify-content-start"}>
          <Button variant={"primary"} className={"d-flex align-items-center"}
                  onClick={() => setShowDepositModal(true)}>
            <BsArrowDown/>&nbsp;Deposit
          </Button>
          <Button variant={"success"} className={"d-flex align-items-center gap-1"}
                  onClick={() => setShowRepaymentModal(true)}>
            <BsArrowLeftRight/>&nbsp;Repayment
          </Button>
        </div>
        <Button variant={"secondary"} className={"d-flex align-items-center gap-1"}
                href={new UrlPattern(UrlsFront.EVENT_SETTINGS).stringify({"eventId": event.id})}>
          <BsGear/>&nbsp;Settings
        </Button>
      </div>
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
      </Col>
    </Row>
    <NewDepositModal event={event} show={showDepositModal} setShow={setShowDepositModal}/>
    <NewRepaymentModal event={event} show={showRepaymentModal} setShow={setShowRepaymentModal}/>
  </Template>);
}
