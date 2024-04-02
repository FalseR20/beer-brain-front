import {CEvent} from "../../dataclasses.ts";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import * as yup from "yup";
import {Formik} from "formik";
import {createDeposit} from "../../fetches.tsx";
import {useTranslation} from "react-i18next";

export default function NewDepositModal({event, show, setShow}: {
  event: CEvent,
  show: boolean,
  setShow: (show: boolean) => void,
}) {
  const {t} = useTranslation();
  const handleClose = () => setShow(false);

  return <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{t("Create deposit title")}</Modal.Title>
    </Modal.Header>
    <Formik
      validationSchema={yup.object().shape({
        value: yup.number().positive().lessThan(1e10).required().lessThan(1e10),
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
          <Modal.Body className={"d-flex flex-column gap-3"}>
            <Form.Group controlId="validationFormikValue">
              <Form.Label>{t("Value")}</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="7.62"
                  inputMode={"numeric"}
                  name="value"
                  onChange={handleChange}
                  isInvalid={!!errors.value}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.value}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="validationFormikDescription">
              <Form.Label>{t("Description")}</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  placeholder={t("Deposit description placeholder")}
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
            <Button variant="primary" type="submit">{t("Create deposit")}</Button>
          </Modal.Footer>
        </Form>
      )}
    </Formik>

  </Modal>
}