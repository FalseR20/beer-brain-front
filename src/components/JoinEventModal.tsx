import "../css/CreateEvent.css";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {joinEvent} from "../fetches.tsx";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../urls.ts";

export default function JoinEventModal({show, setShow}: {
  show: boolean;
  setShow: (show: boolean) => void,
}) {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Join event</Modal.Title>
      </Modal.Header>
      <Formik
        validationSchema={yup.object().shape({
          event_id: yup.string().required(),
        })}
        onSubmit={(values) => {
          joinEvent(values.event_id).then(() => {
            window.location.href = new UrlPattern(UrlsFront.EVENT).stringify({"eventId": values.event_id});
          });
        }}
        initialValues={{
          event_id: "",
        }}
      >
        {({handleSubmit, handleChange, values, errors}) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group controlId="validationFormikDescription">
                <Form.Label>Event id</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="00000000-0000-0000-0000-000000000000"
                    aria-describedby="inputGroupPrepend"
                    name="event_id"
                    value={values.event_id}
                    onChange={handleChange}
                    isInvalid={!!errors.event_id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.event_id}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">Join</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
