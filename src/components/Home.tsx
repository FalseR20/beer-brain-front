import Template from "./Template.tsx";
import {useEffect, useState} from "react";
import {Alert, Button, Card, Col, Row} from "react-bootstrap";
import NewEventModal from "./NewEventModal.tsx";
import JoinEventModal from "./JoinEventModal.tsx";
import {CEvent} from "../dataclasses.ts";
import {throwIfUnauthorized, getEventList} from "../fetches.tsx";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../urls.ts";


export default function Home() {
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showJoinEventModal, setShowJoinEventModal] = useState(false);
  const [events, setEvents] = useState<CEvent[]>();

  useEffect(() => {
    getEventList()
      .then(setEvents)
      .catch(throwIfUnauthorized)
  }, []);

  if (events == undefined) {
    return <Template/>
  }
  return (
    <Template title="Home page">
      <Alert variant="light" className={"mb-3 bg-body-tertiary"}>
        <Alert.Heading>All events</Alert.Heading>
        <p>
          There are all debts. You can create a new one or join to the existed
          one.
        </p>
        <hr/>
        <div className={"d-flex flex-row justify-content-end"}>
          <Button
            className={"fs-6"}
            variant={"outline-success"}
            onClick={() => setShowJoinEventModal(true)}
          >
            Join event
          </Button>
          <Button
            className={"fs-6 ms-4"}
            variant={"success"}
            onClick={() => setShowNewEventModal(true)}
          >
            Create event
          </Button>
        </div>
      </Alert>
      <NewEventModal
        show={showNewEventModal}
        setShow={setShowNewEventModal}
      />
      <JoinEventModal
        show={showJoinEventModal}
        setShow={setShowJoinEventModal}
      />
      <Row xs={1} md={2} className={"g-3"}>
        {events.map((event) => {
          const variant = event.isClosed ? "secondary" : "primary";
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
                  <Card.Title>{event.name}</Card.Title>
                  <Card.Text>{event.users.length} members</Card.Text>
                  <Row className={"mx-0"}>
                    <Button
                      variant={variant}
                      size={"lg"}
                      href={new UrlPattern(UrlsFront.EVENT).stringify({"eventId": event.id})}
                    >
                      Look
                    </Button>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Template>
  );
}
