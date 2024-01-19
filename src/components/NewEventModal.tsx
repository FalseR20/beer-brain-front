import "../css/CreateEvent.css";
import getAuthHeaders from "../tokens.ts";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {make_url, UrlPatterns} from "../constants.ts";

async function createEventAPI(inputs: { name: string }) {
  console.log(`Create event ${inputs}`);
  const formData = new FormData();
  formData.append("name", inputs.name);
  formData.append("date", "2000-01-01");
  const response = await fetch(make_url(UrlPatterns.CREATE_EVENT), {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  if (response.ok) {
    const json = await response.json();
    console.log(`Created, ${JSON.stringify(json)}`);
    return json;
  }
}

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
            createEventAPI(values).then((json) => {
              window.location.href = `/events/${json.id}`;
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
