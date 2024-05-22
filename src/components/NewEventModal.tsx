import "../css/CreateEvent.css";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {createEventAPI} from "../fetches.tsx";
import {make_front_url, UrlsFront} from "../urls.ts";
import moment from "moment/moment";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

export default function NewEventModal({show, setShow}: {
  show: boolean;
  setShow: (show: boolean) => void,
}) {
  const navigate = useNavigate();
  const {t} = useTranslation();
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("Create event title")}</Modal.Title>
      </Modal.Header>
      <Formik
        validationSchema={yup.object().shape({
          name: yup.string().required(),
          description: yup.string(),
          date: yup.date().required(),
        })}
        onSubmit={(values) => {
          createEventAPI(values).then((event) => {
            navigate(make_front_url(UrlsFront.EVENT, {"eventId": event.id}))
          });
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
                <Form.Label>{t("Name")}</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder={t("Name placeholder")}
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
                <Form.Label>{t("Description")}</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder={t("Description placeholder")}
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
                <Form.Label>{t("Date")}</Form.Label>
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
              <Button type="submit">{t("Create event")}</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
