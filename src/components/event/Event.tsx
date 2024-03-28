import {lazy, useContext, useState} from "react";
import "../../css/Event.css";
import {Badge, Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {make_front_url, UrlsFront} from "../../urls.ts";
import NewDepositModal from "./NewDepositModal.tsx";
import NewRepaymentModal from "./NewRepaymentModal.tsx";
import {BsArrowDown, BsArrowLeftRight, BsGear, BsShare} from "react-icons/bs";
import {useDetailedEvent} from "./UseDetailedEvent.tsx";
import ShareModal from "./ShareModal.tsx";
import {BALANCE_FORMAT, BANK_FORMAT} from "../../constants.ts";
import {UserAvatar} from "../user/UserAvatar.tsx";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import ActionItem from "./ActionItem.tsx";
import {AuthContext} from "../../contexts/authContext.tsx";

const NotFound = lazy(() => import("../NotFound.tsx"))
const Template = lazy(() => import("../template/Template.tsx"))

export default function Event() {
  const {t} = useTranslation();
  const {event, is404} = useDetailedEvent()
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showRepaymentModal, setShowRepaymentModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const {user} = useContext(AuthContext)

  if (!event || !user) {
    return is404 ? <NotFound/> : <Template/>;
  }

  return (<Template title={event.name}>
    <div id={"event-header"}>
      <div id={"event-header-top"}
           className={"border-bottom color-border-muted pb-3 d-flex justify-content-between"}>
        <div className={"d-flex flex-column justify-content-end"}>
          <span className={"fs-4 fw-bold"}>
            {event.name}
          </span>
          <span className={"fs-6"}>
            {event.description}
          </span>
        </div>
        <div className={"d-flex flex-column align-items-end"}>
          <span className={"fw-bold fs-4 text-end"}>
            <span className={"text-muted"}>{t("Bank")} </span>
            {BANK_FORMAT.format(event.bank)}
            </span>
          <span className={"fs-6 text-end"}>
            {BANK_FORMAT.format(event.bankPart)}
            <span className={"text-muted"}> {t("each")}</span>
          </span>
        </div>
      </div>
      <Container className={"py-3"} fluid={true}>
        <Row className={"gap-3 justify-content-between"}>
          <Col xs={true} sm={"auto"}>
            <Row className={"gap-3"}>
              <Col xs={false} sm={"auto"} className={"px-0"}>
                <Button variant={"primary"}
                        className={"d-flex justify-content-center align-items-center w-100"}
                        onClick={() => setShowDepositModal(true)}>
                  <BsArrowDown/>&nbsp;{t("Create deposit button")}
                </Button>
              </Col>
              <Col xs={false} sm={"auto"} className={"px-0"}>
                <Button variant={"success"}
                        className={"d-flex justify-content-center align-items-center gap-1 w-100"}
                        onClick={() => setShowRepaymentModal(true)}>
                  <BsArrowLeftRight/>&nbsp;{t("Create repayment button")}
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs={true} sm={"auto"}>
            <Row className={"gap-3"}>
              <Col xs={false} sm={"auto"} className={"px-0"}>
                <Button variant={"info"}
                        className={"d-flex justify-content-center align-items-center gap-1 w-100"}
                        onClick={() => setShowShareModal(true)}>
                  <BsShare/>&nbsp;{t("Share title")}
                </Button>
              </Col>
              <Col xs={false} sm={"auto"} className={"px-0"}>
                <Link to={make_front_url(UrlsFront.EVENT_SETTINGS, {"eventId": event.id})}
                      className={"text-decoration-none"}>
                  <Button variant={"secondary"}
                          className={"d-flex justify-content-center align-items-center gap-1 w-100"}>
                    <BsGear/>&nbsp;{t("Settings")}
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>

    <Container fluid={true} className={"p-0"}>
      <Row className={"g-3"}>
        {/* Members card */}
        <Col lg={5} className={"px-2"}>
          <Card>
            <Card.Header>
              {t("Members")}
            </Card.Header>
            <ListGroup variant={"flush"}>
              {event.users.map((user) => (
                <ListGroup.Item key={user.username} action={true} className={"p-3"} as={Link}
                                to={make_front_url(UrlsFront.EVENT_MEMBER, {
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
        {/* Actions card */}
        <Col lg={7} className={"px-2"}>
          <Card>
            <Card.Header>
              {t("Actions")}
            </Card.Header>
            <ListGroup variant={"flush"}>
              {event.getSortedActions().map(action => (
                <ActionItem action_={action} event={event} user={user} key={action.id}/>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>

    <NewDepositModal event={event} show={showDepositModal} setShow={setShowDepositModal}/>
    <NewRepaymentModal event={event} show={showRepaymentModal} setShow={setShowRepaymentModal}/>
    <ShareModal event={event} show={showShareModal} setShow={setShowShareModal}/>
  </Template>);
}
