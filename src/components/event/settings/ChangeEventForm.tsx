import {CEvent} from "../../../dataclasses.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Formik} from "formik";
import * as yup from "yup";
import {updateEvent} from "../../../fetches.tsx";
import {make_front_url, UrlsFront} from "../../../urls.ts";
import moment from "moment/moment";
import {Button, Form, InputGroup} from "react-bootstrap";

export function ChangeEventForm({event, isHost}: { event: CEvent, isHost: boolean }) {
  const navigate = useNavigate()
  const {t} = useTranslation();
  return (
    <Formik
      validationSchema={yup.object().shape({
        name: yup.string().required(),
        description: yup.string(),
        date: yup.date().required(),
      })}
      onSubmit={(values) => {
        console.log(values);
        updateEvent(event.id, values).then((event) => {
          navigate(make_front_url(UrlsFront.EVENT, {"eventId": event.id}))
        });
        console.log(values.date)
      }}
      initialValues={{
        name: event.name,
        description: event.description,
        date: moment(event.date).format('YYYY-MM-DD'),
      }}
    >
      {({handleSubmit, handleChange, values, errors}) => (
        <Form noValidate onSubmit={handleSubmit}
              className={"d-flex flex-column gap-3 w-50"}>
          <Form.Group controlId="validationFormikName">
            <Form.Label>{t("Name")}</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder={t("Name placeholder")}
                name="name"
                value={values.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                disabled={!isHost}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>{t("Description")}</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder=""
                name="description"
                value={values.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
                disabled={!isHost}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>{t("Date")}</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
                isInvalid={!!errors.date}
                disabled={!isHost}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <div>
            <Button type="submit" disabled={!isHost}>{t("Update event")}</Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}