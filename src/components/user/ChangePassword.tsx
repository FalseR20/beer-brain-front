import {useContext, useState} from "react";
import {AuthContext} from "../../contexts/authContext.tsx";
import Template from "../Template.tsx";
import {Formik} from "formik";
import * as yup from "yup";
import {Button, Form, InputGroup} from "react-bootstrap";
import {BsEye, BsEyeSlash} from "react-icons/bs";
import {changePassword} from "../../fetches.tsx";
import {ResponseError} from "../../errors.ts";
import {make_front_url, UrlsFront} from "../../urls.ts";

export default function ChangePassword() {
  const user = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  if (!user) {
    return <Template/>
  }
  return (
    <Template noWrap={true} title={"Change password"}>
      <div id={"common-field"} className={"m-3 mt-5 width-30"}>
        <h1 className={"text-center"}>Change password</h1>
        <Formik
          validationSchema={yup.object().shape({
            oldPassword: yup.string().required(),
            newPassword: yup.string().required(),
          })}
          onSubmit={(values, formikHelpers) => {
            changePassword(values).then(() => {
              window.location.href = `${make_front_url(UrlsFront.USER, {username: user.username})}?showPasswordChanged`
            }).catch((reason) => {
              formikHelpers.setSubmitting(false);
              if (reason instanceof ResponseError) {
                reason.response.text().then((value) => {
                  const errors: {
                    old_password?: Array<string>,
                    new_password?: Array<string>,
                  } = JSON.parse(value)
                  if (errors.old_password) {
                    formikHelpers.setFieldError("oldPassword", errors.old_password.join("\n"));
                  }
                  if (errors.new_password) {
                    formikHelpers.setFieldError("newPassword", errors.new_password.join("\n"));
                  }
                })
              }
            });
          }}
          initialValues={{
            oldPassword: "",
            newPassword: "",
          }}
        >
          {({handleSubmit, handleChange, values, errors}) => (
            <Form noValidate onSubmit={handleSubmit} className={"d-flex flex-column gap-3"}>
              <Form.Group controlId="validationFormikUsername">
                <Form.Label>Old password</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    placeholder="Old password"
                    name="oldPassword"
                    autoComplete={"current-password"}
                    value={values.oldPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.oldPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.oldPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="validationFormikPassword">
                <Form.Label>New password</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="newPassword"
                    autoComplete={"new-password"}
                    value={values.newPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.newPassword}
                  />
                  <Button variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          className={"d-flex align-items-center border-secondary-subtle"}>
                    {showPassword ? <BsEyeSlash/> : <BsEye/>}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.newPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Button variant={"danger"} className={"mt-3"} size={"lg"}
                      type="submit">Change</Button>
            </Form>
          )}
        </Formik>
      </div>
    </Template>
  )
}