import {CDetailedEvent} from "../../dataclasses.ts";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import * as yup from "yup";
import {Formik} from "formik";
import {useContext} from "react";
import {AuthContext} from "../../contexts/authContext.tsx";
import {createRepayment} from "../../fetches.tsx";
import {useTranslation} from "react-i18next";

export default function NewRepaymentModal({event, show, setShow}: {
  event: CDetailedEvent,
  show: boolean,
  setShow: (show: boolean) => void,
}) {
  const {t} = useTranslation();
  const handleClose = () => setShow(false);
  const {user: userMe} = useContext(AuthContext);

  const usersNotMe = event.users.filter((user => !userMe?.equals(user)))

  return <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{t("Create repayment title")}</Modal.Title>
    </Modal.Header>
    <Formik
      validationSchema={yup.object().shape({
        value: yup.number().positive().required(),
        description: yup.string(),
      })}
      onSubmit={(values) => {
        createRepayment(values, event).then(() => {
          handleClose()
          window.location.reload();
        })
      }}
      initialValues={{
        value: 0,
        description: "",
        type: "to",
        user: usersNotMe[0]?.username
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
              <Form.Label>{t("Description")}</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
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
            <div className={"d-flex gap-4"}>
              <Form.Group controlId="validationFormicType">
                <Form.Label>{t("Transaction")}</Form.Label>
                <Form.Select name={"type"} value={values.type} onChange={handleChange}
                             isInvalid={!!errors.type}>
                  <option value={"to"}>{t("To")}</option>
                  <option value={"from"}>{t("From")}</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="validationFormicUser" className={"flex-grow-1"}>
                <Form.Label>{t("User")}</Form.Label>
                <Form.Select name={"user"} value={values.user} onChange={handleChange}
                             isInvalid={!!errors.user}>
                  {usersNotMe.map(user => (
                    <option value={user.username} key={user.username}>
                      {`@${user.username}${user.fullName == "" ? "" : ` (${user.fullName})`}`}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.user}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit">{t("Create repayment")}</Button>
          </Modal.Footer>
        </Form>
      )}
    </Formik>
  </Modal>
}