import "../css/CreateEvent.css";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {createEventAPI} from "../fetches.tsx";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../urls.ts";

export default function NewEventModal(props: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={yup.object().shape({
            name: yup.string().required(),
          })}
          onSubmit={(values) => {
            console.log(values);
            createEventAPI(values).then((event) => {
              window.location.href = new UrlPattern(UrlsFront.EVENT).stringify({"eventId": event.id});
            });
          }}
          initialValues={{
            name: "",
          }}
        >
          {({handleSubmit, handleChange, values, errors}) => (
            <Form noValidate onSubmit={handleSubmit}>
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
              <Button type="submit">Create</Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
