import {Alert, Button, Form, InputGroup, ListGroup, Modal} from "react-bootstrap";
import Template from "../Template.tsx";
import {CDetailedEvent, CEvent} from "../../dataclasses.ts";
import {deleteEvent, leaveEvent, updateEvent} from "../../fetches.tsx";
import NotFound from "../NotFound.tsx";
import * as yup from "yup";
import UrlPattern from "url-pattern";
import {make_front_url, UrlsFront} from "../../urls.ts";
import moment from "moment";
import {Formik} from "formik";
import {useDetailedEvent} from "./UseDetailedEvent.tsx";
import {useContext, useState} from "react";
import {AuthContext} from "../../contexts/authContext.tsx";

export function EventSettings() {
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [showLeaveEventModal, setShowLeaveEventModal] = useState(false);
  const {event, is404} = useDetailedEvent()
  const user = useContext(AuthContext)

  if (event == undefined) {
    return is404 ? <NotFound/> : <Template/>;
  }
  const isHost: boolean | undefined = user?.equals(event.host)

  // const renderTooltip = (props) => (
  //   <Tooltip id="button-tooltip" {...props}>
  //     Simple tooltip
  //   </Tooltip>
  // )

  return (
    <Template title={`settings - ${event.name}`}>
      <Alert show={!(isHost || true)} variant={"warning"}>
        <Alert.Heading>Warning</Alert.Heading>
        You have no rights to to change the event. Ask <Alert.Link
        href={make_front_url(UrlsFront.USER, {username: event.host.username})}>the host
        user</Alert.Link> if you want.
      </Alert>
      <span
        className={"pb-1 border-bottom color-border-muted mb-3 fs-3 fw-bold"}> General </span>
      <ChangeEventForm event={event} isHost={isHost || false}/>

      <span className={"fs-3 fw-bold mt-4 mb-2"}> Danger Zone </span>
      <ListGroup className={"border border-danger rounded-2"} variant={"flush"}>
        <ListGroup.Item className={"d-flex flex-row align-items-center"}>
          <span className={"flex-grow-1"}>Leave this event</span>
          {/*<OverlayTrigger*/}
          {/*  placement="right"*/}
          {/*  delay={{show: 250, hide: 400}}*/}
          {/*  overlay={renderTooltip}*/}
          {/*>*/}
          {/*  */}
          {/*</OverlayTrigger>*/}
          <Button variant={"danger"} className={"my-2"} disabled={isHost}
                  onClick={() => setShowLeaveEventModal(true)}>
            {" "}
            Leave{" "}
          </Button>

        </ListGroup.Item>
        <ListGroup.Item
          className={"d-flex flex-row justify-content-between align-items-center"}
        >
          <span className={"flex-grow-1"}>Delete this event</span>
          <Button variant={"danger"} className={"my-2"} disabled={!isHost}
                  onClick={() => setShowDeleteEventModal(true)}>
            {" "}
            Delete event{" "}
          </Button>
        </ListGroup.Item>
      </ListGroup>
      <LeaveEventModal event={event} show={showLeaveEventModal} setShow={setShowLeaveEventModal}/>
      <DeleteEventModal event={event} show={showDeleteEventModal}
                        setShow={setShowDeleteEventModal}/>
    </Template>
  )
}


function ChangeEventForm({event, isHost}: { event: CEvent, isHost: boolean }) {
  return (
    <Formik
      validationSchema={yup.object().shape({
        name: yup.string().required(),
        description: yup.string(),
        date: yup.date().required(),
      })}
      onSubmit={(values) => {
        console.log(values);
        updateEvent(event.id, values).then((event) => {
          window.location.href = new UrlPattern(UrlsFront.EVENT).stringify({"eventId": event.id});
        });
        console.log(values.date)
      }}
      initialValues={{
        name: event.name,
        description: event.description,
        date: moment(event.date).format('YYYY-MM-DD'),
      }}
    >
      {({handleSubmit, handleChange, values, errors}) => (
        <Form noValidate onSubmit={handleSubmit}
              className={"d-flex flex-column gap-3 w-50"}>
          <Form.Group controlId="validationFormikName">
            <Form.Label>Name</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Chill-Out"
                aria-describedby="inputGroupPrepend"
                name="name"
                value={values.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                disabled={!isHost}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Description (optional)</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder=""
                aria-describedby="inputGroupPrepend"
                name="description"
                value={values.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
                disabled={!isHost}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="date"
                aria-describedby="inputGroupPrepend"
                name="date"
                value={values.date}
                onChange={handleChange}
                isInvalid={!!errors.date}
                disabled={!isHost}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <div>
            <Button type="submit" disabled={!isHost}>Update</Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

function LeaveEventModal({event, show, setShow}: {
  event: CDetailedEvent,
  show: boolean,
  setShow: (show: boolean) => void
}) {

  function handleLeave() {
    leaveEvent(event.id).then(() => {
      window.location.href = UrlsFront.HOME
    })
  }

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          Leave event
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to leave this event?
        You'll be able to return any time.
      </Modal.Body>
      <Modal.Footer>
        <Button variant={"outline-secondary"} onClick={() => setShow(false)}>Cancel</Button>
        <Button variant={"danger"} onClick={handleLeave}>Leave</Button>
      </Modal.Footer>
    </Modal>
  )
}

function DeleteEventModal({event, show, setShow}: {
  event: CDetailedEvent,
  show: boolean,
  setShow: (show: boolean) => void
}) {

  function handleDelete() {
    deleteEvent(event.id).then(() => {
      window.location.href = UrlsFront.HOME
    })
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} contentClassName={"border-danger"}>
      <Modal.Header closeButton>
        <Modal.Title>
          Delete event
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this event?
        This action cannot be rolled back
      </Modal.Body>
      <Modal.Footer>
        <Button variant={"outline-secondary"} onClick={() => setShow(false)}>Cancel</Button>
        <Button variant={"danger"} onClick={handleDelete}>Delete</Button>
      </Modal.Footer>
    </Modal>
  )
}
