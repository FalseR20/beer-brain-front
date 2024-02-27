import {CEvent} from "../../dataclasses.ts";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import * as yup from "yup";
import {Formik} from "formik";
import {createDeposit} from "../../fetches.tsx";

export default function NewDepositModal({event, show, setShow}: {
  event: CEvent,
  show: boolean,
  setShow: (show: boolean) => void,
}) {
  const handleClose = () => setShow(false);

  return <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Create new deposit</Modal.Title>
    </Modal.Header>
    <Formik
      validationSchema={yup.object().shape({
        value: yup.number().positive().required(),
        description: yup.string(),
      })}
      onSubmit={(values) => {
        createDeposit(values, event).then(() => {
          handleClose()
          window.location.reload();
        })
      }}
      initialValues={{
        value: 0,
        description: "",
      }}
    >
      {({handleSubmit, handleChange, values, errors}) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="validationFormikValue">
              <Form.Label>Value</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="7.62"
                  inputMode={"numeric"}
                  aria-describedby="inputGroupPrepend"
                  name="value"
                  // value={values.value}
                  onChange={handleChange}
                  isInvalid={!!errors.value}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.value}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="validationFormikDescription">
              <Form.Label>Description</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  placeholder="Beer and crisps"
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">Add deposit</Button>
          </Modal.Footer>
        </Form>
      )}
    </Formik>

  </Modal>
}