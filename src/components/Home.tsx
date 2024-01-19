import Template from "./Template.tsx";
import {ReactNode, useEffect, useState} from "react";
import getAuthHeaders from "../tokens.ts";
import {Alert, Button, Card, Col, Row} from "react-bootstrap";
import NewEventModal from "./NewEventModal.tsx";
import JoinEventModal from "./JoinEventModal.tsx";
import {make_url, UrlPatterns} from "../constants.ts";
import {IEvent} from "../interfaces.ts";

export default function Home() {
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showJoinEventModal, setShowJoinEventModal] = useState(false);

  return (
    <Template isAuthRequired={true}>
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
        onHide={() => setShowNewEventModal(false)}
      />
      <JoinEventModal
        show={showJoinEventModal}
        onHide={() => setShowJoinEventModal(false)}
      />
      <Debts/>
    </Template>
  );
}

function Debts(): ReactNode {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    fetch(make_url(UrlPatterns.GET_EVENT_LIST), {
      headers: getAuthHeaders(),
    })
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <Row xs={1} md={2} className={"g-3"}>
      {events.map((event) => {
        const variant = event.is_closed ? "secondary" : "primary";
        return (
          <Col key={`Debt${event.id}`}>
            <Card className={"p-0"} border={variant}>
              <Card.Header>
                <Row>
                  <Col>
                    <span>{event.date}</span>
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
                    href={`/events/${event.id}/`}
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
  );
}
