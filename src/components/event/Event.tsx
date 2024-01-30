import {useParams} from "react-router-dom";
import Template from "../Template.tsx";
import {useEffect, useState} from "react";
import NotFound from "../NotFound.tsx";
import "../../css/Event.css";
import {IDetailedEvent} from "../../interfaces.ts";
import {catchUnauthorized, FetchError, getDetailedEvent} from "../../fetches.tsx";
import {Badge, Card, Col, ListGroup, Row, Tab} from "react-bootstrap";
import {UserAvatar} from "../user/UserAvatar.tsx";

export default function Event() {
  const [event, setEvent] = useState<IDetailedEvent>();
  const [is404, setIs404] = useState<boolean>(false)

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

  event.users.sort((a, b) => a.balance - b.balance)
  const balanceFormat = new Intl.NumberFormat("en-us", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  })

  return (<Template>
    {/* Event header */}
    <Card>
      <Card.Body>
        <Card.Title>
          {event.name}
        </Card.Title>
        <Card.Subtitle className={"text-muted"}>
          {event.description}
        </Card.Subtitle>
      </Card.Body>
    </Card>

    <Tab.Container id="users-actions" defaultActiveKey={'#' + event.users[0].username}>
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
                                href={`#${user.username}`}>
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
                        {balanceFormat.format(user.balance)}
                      </h3>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        {/* Actions card */}
        <Col className={"p-0"}>
          <Card>
            <Card.Header>
              Actions
            </Card.Header>
            <Tab.Content>
              {event.users.map(user => (
                <Tab.Pane eventKey={`#${user.username}`}>
                  <ListGroup variant={"flush"}>
                    {user.deposits.length == 0 && user.repayments.length == 0 ? (
                      <ListGroup.Item>
                        <div className={"d-flex flex-row gap-3 align-items-center my-1"}>
                          <Card.Title className={"mb-0"}>
                            <i>No actions</i>
                          </Card.Title>
                        </div>
                      </ListGroup.Item>
                    ) : ""}
                    {user.deposits.map(deposit => (
                      <ListGroup.Item>
                        <div className={"d-flex flex-row gap-3 align-items-center my-1"}>
                          <Card.Title className={"mb-0"}>
                            {deposit.description == "" ? <i>undefined</i> : deposit.description}
                          </Card.Title>
                        </div>
                      </ListGroup.Item>
                    ))}
                    {user.repayments.map(repayment => (
                      <ListGroup.Item>
                        <div className={"d-flex flex-row gap-3 align-items-center my-1"}>
                          <Card.Title className={"mb-0"}>
                            {repayment.description == "" ? <i>undefined</i> : repayment.description}
                          </Card.Title>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                </Tab.Pane>
              ))}
            </Tab.Content>
          </Card>
        </Col>
      </Row>
    </Tab.Container>
  </Template>);
}
