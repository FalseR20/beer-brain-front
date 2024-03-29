import "../css/CreateEvent.css";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {joinEvent} from "../fetches.tsx";
import {make_front_url, UrlsFront} from "../urls.ts";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

export default function JoinEventModal({show, setShow}: {
  show: boolean;
  setShow: (show: boolean) => void,
}) {
  const navigate = useNavigate();
  const {t} = useTranslation();
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("Join event title")}</Modal.Title>
      </Modal.Header>
      <Formik
        validationSchema={yup.object().shape({
          event_id: yup.string().required(),
        })}
        onSubmit={(values) => {
          joinEvent(values.event_id).then(() => {
            navigate(make_front_url(UrlsFront.EVENT, {"eventId": values.event_id}))
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
                <Form.Label>{t("Event id")}</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="00000000-0000-0000-0000-000000000000"
                    name="event_id"
                    autoComplete={"off"}
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
              <Button type="submit">{t("Join event")}</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
