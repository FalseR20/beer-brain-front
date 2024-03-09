import {Button, Form, InputGroup, ListGroup} from "react-bootstrap";
import Template from "../Template.tsx";
import {CEvent} from "../../dataclasses.ts";
import {updateEvent} from "../../fetches.tsx";
import NotFound from "../NotFound.tsx";
import * as yup from "yup";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../../urls.ts";
import moment from "moment";
import {Formik} from "formik";
import {useDetailedEvent} from "./UseDetailedEvent.tsx";

export function EventSettings() {
  const {event, is404} = useDetailedEvent()

  if (event == undefined) {
    return is404 ? <NotFound/> : <Template/>;
  }

  return (
    <Template title={`settings - ${event.name}`}>
      <span
        className={"mt-4 pb-1 border-bottom color-border-muted mb-3 fs-3 fw-bold"}> General </span>
      <ChangeEventForm event={event}/>

      <span className={"fs-3 fw-bold mt-4 mb-2"}> Danger Zone </span>
      <ListGroup className={"border border-danger rounded-2"} variant={"flush"}>
        <ListGroup.Item className={"d-flex flex-row align-items-center"}>
          <span className={"flex-grow-1"}>Leave this event</span>
          <Button variant={"danger"} className={"my-2"}>
            {" "}
            Leave{" "}
          </Button>
        </ListGroup.Item>
        <ListGroup.Item
          className={"d-flex flex-row justify-content-between align-items-center"}
        >
          <span className={"flex-grow-1"}>Delete this event</span>
          <Button variant={"danger"} className={"my-2"}>
            {" "}
            Delete event{" "}
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Template>
  )
}


function ChangeEventForm({event}: { event: CEvent }) {
  return (
    <div>
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
                className={"d-flex flex-column gap-2 align-items-start"}>
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
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Button type="submit">Update</Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}