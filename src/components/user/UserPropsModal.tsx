import {CUser} from "../../dataclasses.ts";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {updateUser} from "../../fetches.tsx";
import {make_front_url, UrlsFront} from "../../urls.ts";
import {useTranslation} from "react-i18next";
import {lazy} from "react";
import {useNavigate} from "react-router-dom";

const UserTemplate = lazy(() => import("./UserTemplate.tsx"))


export function UserPropsModal({user, show, setShow}: {
  user: CUser,
  show: boolean,
  setShow: (show: boolean) => void
}) {
  const navigate = useNavigate();
  const {t} = useTranslation();
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("Update user")}</Modal.Title>
      </Modal.Header>
      <Formik
        validationSchema={yup.object().shape({
          username: yup.string().required(),
          fullName: yup.string(),
        })}
        onSubmit={(values, formikHelpers) => {
          if (user.equalsFull(values)) {
            formikHelpers.setSubmitting(false);
            formikHelpers.setFieldError("username", "");
            return
          }
          updateUser({
            username: user.username != values.username ? values.username : undefined,
            fullName: user.fullName != values.fullName ? values.fullName : undefined,
          })
            .then(() => {
              setShow(false)
              if (user.username != values.username) {
                navigate(make_front_url(UrlsFront.USER, {username: values.username}))
              } else {
                window.location.reload()
              }
            })
            .catch(() => {
              formikHelpers.setSubmitting(false);
              formikHelpers.setFieldError("username", "User already exists");
            })
        }}
        initialValues={new CUser({id: user.id, username: user.username, full_name: user.fullName})}
      >
        {({values, handleSubmit, handleReset, handleBlur, handleChange, errors}) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Body className={"d-flex flex-column gap-3"}>
              <UserTemplate user={values}/>
              <Form.Group controlId="validationFormikUsername">
                <Form.Label>{t("Username")}</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="username"
                    name="username"
                    autoComplete={"username"}
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="validationFormikFullname">
                <Form.Label>{t("Full name")}</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="CuCum Bear"
                    name="fullName"
                    autoComplete={"name"}
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant={"outline-secondary"} onClick={handleReset}>{t("Reset")}</Button>
              <Button variant={"success"} type="submit">{t("Update")}</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
