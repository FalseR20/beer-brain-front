import {lazy, useContext, useEffect, useState} from "react";
import {Alert, Button, Card, Col, Container, Row} from "react-bootstrap";
import NewEventModal from "./NewEventModal.tsx";
import JoinEventModal from "./JoinEventModal.tsx";
import {CDetailedEvent} from "../dataclasses.ts";
import {getEventList} from "../fetches.tsx";
import {make_front_url, UrlsFront} from "../urls.ts";
import {useTranslation} from "react-i18next";
import useGuest from "./useGuest.tsx";
import {Link} from "react-router-dom";
import {AuthContext} from "../contexts/authContext.tsx";
import {BALANCE_FORMAT} from "../constants.ts";

const Template = lazy(() => import("./template/Template.tsx"))


export default function Home() {
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showJoinEventModal, setShowJoinEventModal] = useState(false);
  const [events, setEvents] = useState<CDetailedEvent[]>();
  const {user} = useContext(AuthContext)
  const {t} = useTranslation();
  const {redirectGuest} = useGuest()

  useEffect(() => {
    getEventList()
      .then(setEvents)
      .catch(redirectGuest)
  }, []);

  if (!events || !user) {
    return <Template/>
  }
  return (
    <Template title={t("Home page")}>
      <Alert variant="light" className={"mb-3 bg-body-tertiary"}>
        <Alert.Heading>
          {t("All events")}
        </Alert.Heading>
        <p>
          {t("All events description")}
        </p>
        <hr/>
        <Container fluid={true}>
          <Row className={"gap-3"}>
            <Col xs={true} sm={"auto"} className={"px-0 ms-auto"}>
              <Button
                className={"w-100 h-100"}
                variant={"outline-success"}
                onClick={() => setShowJoinEventModal(true)}
              >
                {t("Join event")}
              </Button>
            </Col>
            <Col xs={true} sm={"auto"} className={"px-0"}>
              <Button
                className={"w-100 h-100"}
                variant={"success"}
                onClick={() => setShowNewEventModal(true)}
              >
                {t("Create event")}
              </Button>
            </Col>
          </Row>
        </Container>
      </Alert>
      <Row xs={1} md={2} className={"g-3"}>
        {events.map((event) => {
          const variant = event.isClosed ? "secondary" : "primary";
          let balance = event.users.find(value => value.equals(user))!.balance
          balance = Math.round(balance * 100) / 100
          return (
            <Col key={`Debt${event.id}`}>
              <Card className={"p-0"} border={variant}>
                <Card.Header>
                  <Row>
                    <Col>
                      <span>{event.date.toDateString()}</span>
                    </Col>
                    <Col className={"text-end"}>Host: {event.host.username}</Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <div className={"d-flex flex-row align-items-center mb-3"}>
                    <div className={"flex-grow-1"}>
                      <Card.Title>{event.name}</Card.Title>
                      <Card.Text>{t("members", {count: event.users.length})}</Card.Text>
                    </div>
                    <div
                      className={`fs-3 ${balance > 0.0 ? "text-success" : (balance < 0.0 ? "text-danger" : "")}`}>
                      {BALANCE_FORMAT.format(balance)}
                    </div>
                  </div>

                  <Link to={make_front_url(UrlsFront.EVENT, {"eventId": event.id})}>
                    <Button
                      className={"w-100"}
                      variant={variant}
                      size={"lg"}
                    >
                      {t("Look")}
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      <NewEventModal
        show={showNewEventModal}
        setShow={setShowNewEventModal}
      />
      <JoinEventModal
        show={showJoinEventModal}
        setShow={setShowJoinEventModal}
      />
    </Template>
  );
}
