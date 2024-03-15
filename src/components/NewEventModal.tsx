import "../css/CreateEvent.css";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {createEventAPI} from "../fetches.tsx";
import UrlPattern from "url-pattern";
import {UrlsFront} from "../urls.ts";
import moment from "moment/moment";

export default function NewEventModal({show, setShow}: {
  show: boolean;
  setShow: (show: boolean) => void,
}) {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Create event</Modal.Title>
      </Modal.Header>
      <Formik
        validationSchema={yup.object().shape({
          name: yup.string().required(),
          description: yup.string(),
          date: yup.date().required(),
        })}
        onSubmit={(values) => {
          console.log(values);
          createEventAPI(values).then((event) => {
            window.location.href = new UrlPattern(UrlsFront.EVENT).stringify({"eventId": event.id});
          });
          console.log(values.date)
        }}
        initialValues={{
          name: "",
          description: "",
          date: moment().format('YYYY-MM-DD'),
        }}
      >
        {({handleSubmit, handleChange, values, errors}) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Body className={"d-flex flex-column gap-3"}>
              <Form.Group controlId="validationFormikName">
                <Form.Label>Name</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Chill-Out"
                    name="name"
                    autoComplete={"off"}
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="validationFormikDescription">
                <Form.Label>Description (optional)</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Cultural recreation"
                    name="description"
                    autoComplete={"off"}
                    value={values.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="validationFormikDate">
                <Form.Label>Date</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="date"
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
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">Create</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
