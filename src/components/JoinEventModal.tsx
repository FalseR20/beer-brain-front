import "../css/CreateEvent.css";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {joinEvent} from "../fetches.tsx";

export default function JoinEventModal(props: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Join event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={yup.object().shape({
            event_id: yup.string().required(),
          })}
          onSubmit={(values) => {
            joinEvent(values.event_id).then(() => {
              window.location.href = `/events/${values.event_id}`;
            });
          }}
          initialValues={{
            event_id: "",
          }}
        >
          {({handleSubmit, handleChange, values, errors}) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="validationFormikDescription">
                <Form.Label>Event id</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="12"
                    aria-describedby="inputGroupPrepend"
                    name="id"
                    value={values.event_id}
                    onChange={handleChange}
                    isInvalid={!!errors.event_id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.event_id}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Button type="submit">Join</Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
