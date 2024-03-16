import {
  Alert,
  Button,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
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
import {Trans, useTranslation} from "react-i18next";

export function EventSettings() {
  const {t} = useTranslation();
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [showLeaveEventModal, setShowLeaveEventModal] = useState(false);
  const {event, is404} = useDetailedEvent()
  const user = useContext(AuthContext)

  if (event == undefined) {
    return is404 ? <NotFound/> : <Template/>;
  }
  const isHost: boolean | undefined = user?.equals(event.host)

  return (
    <Template title={t("Settings title", {name: event.name})}>
      <Alert show={isHost == false} variant={"warning"}>
        <Alert.Heading>{t("Settings rights warning")}</Alert.Heading>
        <Trans t={t}
               i18nKey="Settings rights"
               components={{
                 host: (
                   <Alert.Link
                     href={make_front_url(UrlsFront.USER, {username: event.host.username})}
                   />
                 )
               }}/>

      </Alert>
      <span
        className={"pb-1 border-bottom color-border-muted mb-3 fs-3 fw-bold"}>{t("Settings")}</span>
      <ChangeEventForm event={event} isHost={isHost == true}/>

      <span className={"fs-3 fw-bold mt-4 mb-2"}>{t("Danger Zone")}</span>
      <ListGroup className={"border border-danger rounded-2"} variant={"flush"}>
        <ListGroup.Item className={"d-flex flex-row align-items-center"}>
          <span className={"flex-grow-1"}>{t("Leave event description")}</span>
          {isHost ? (
            <OverlayTrigger
              placement="left"
              overlay={<Tooltip>{t("Leave event host")}</Tooltip>}
            >
            <span className="d-inline-block">
            <Button variant={"danger"} className={"my-2"} disabled={true}
                    style={{pointerEvents: 'none'}}>
              Leave
            </Button>
            </span>
            </OverlayTrigger>
          ) : (
            <Button variant={"danger"} className={"my-2"} disabled={isHost}
                    onClick={() => setShowLeaveEventModal(true)}>
              {t("Leave event")}
            </Button>
          )}


        </ListGroup.Item>
        <ListGroup.Item
          className={"d-flex flex-row justify-content-between align-items-center"}
        >
          <span className={"flex-grow-1"}>{t("Delete event description")}</span>
          <Button variant={"danger"} className={"my-2"} disabled={!isHost}
                  onClick={() => setShowDeleteEventModal(true)}>
            {t("Delete event")}
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
  const {t} = useTranslation();
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
            <Form.Label>{t("Name")}</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder={t("Name placeholder")}
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
            <Form.Label>{t("Description")}</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder=""
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
            <Form.Label>{t("Date")}</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="date"
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
            <Button type="submit" disabled={!isHost}>{t("Update event")}</Button>
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
  const {t} = useTranslation();
  function handleLeave() {
    leaveEvent(event.id).then(() => {
      window.location.href = UrlsFront.HOME
    })
  }

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("Leave event description")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t("Leave event warning")}</Modal.Body>
      <Modal.Footer className={"gap-2"}>
        <Button variant={"outline-secondary"} onClick={() => setShow(false)}>{t("Cancel")}</Button>
        <Button variant={"danger"} onClick={handleLeave}>{t("Leave event")}</Button>
      </Modal.Footer>
    </Modal>
  )
}

function DeleteEventModal({event, show, setShow}: {
  event: CDetailedEvent,
  show: boolean,
  setShow: (show: boolean) => void
}) {
  const {t} = useTranslation();

  function handleDelete() {
    deleteEvent(event.id).then(() => {
      window.location.href = UrlsFront.HOME
    })
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} contentClassName={"border-danger"}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("Delete event description")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{t("Delete event warning")}</Modal.Body>
      <Modal.Footer>
        <Button variant={"outline-secondary"} onClick={() => setShow(false)}>{t("Cancel")}</Button>
        <Button variant={"danger"} onClick={handleDelete}>{t("Delete event")}</Button>
      </Modal.Footer>
    </Modal>
  )
}
