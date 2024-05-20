import {CDetailedEvent} from "../../../dataclasses.ts";
import {useTranslation} from "react-i18next";
import {Button, Form, Modal} from "react-bootstrap";
import {Dispatch, SetStateAction, useContext} from "react";
import {Formik} from "formik";
import * as yup from "yup";
import {AuthContext} from "../../../contexts/authContext.tsx";
import {transferHost} from "../../../fetches.tsx";

export function TransferHostModal({event, setEvent, state}: {
  event: CDetailedEvent,
  setEvent: Dispatch<SetStateAction<CDetailedEvent | undefined>>
  state: [boolean, Dispatch<SetStateAction<boolean>>]
}) {
  // const navigate = useNavigate()
  const {t} = useTranslation();
  const [show, setShow] = state
  const {user: userMe} = useContext(AuthContext);

  if (!userMe) {
    return <></>
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} contentClassName={"border-warning"}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("Transfer host rights")}
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{newHost: userMe.id}}
        onSubmit={(values) => {
          console.log(values.newHost)
          transferHost(event.id, values).then(setEvent).then(
            () => setShow(false)
          )
        }}
        validationSchema={yup.object().shape({
          newHost: yup.string().required()
        })}
      >
        {props =>
          <Form noValidate onSubmit={props.handleSubmit}>
            <Modal.Body className={"d-flex flex-column gap-3"}>
              <Form.Group controlId="validationFormicHost" className={"flex-grow-1"}>
                <Form.Label>{t("New Host")}</Form.Label>
                <Form.Select name={"newHost"} value={props.values.newHost}
                             onChange={props.handleChange}
                             isInvalid={!!props.errors.newHost}>
                  {event.users.map(user => (
                    <option value={user.id} key={user.id}>
                      {`@${user.username}${user.fullName == "" ? "" : ` (${user.fullName})`}`}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {props.errors.newHost}
                </Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant={"outline-secondary"}
                      onClick={() => setShow(false)}>{t("Cancel")}</Button>
              <Button variant="warning" type="submit"
                      disabled={props.values.newHost == userMe?.id}>{t("Create deposit")}</Button>
            </Modal.Footer>
          </Form>
        }
      </Formik>
    </Modal>
  )
}