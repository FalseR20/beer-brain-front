import Template from "./Template.tsx";
import {Button, Form, InputGroup} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {fetchSignUp} from "../fetches.tsx";
import {UrlsFront} from "../urls.ts";
import {useState} from "react";
import {BsEye, BsEyeSlash} from "react-icons/bs";
import {useTranslation} from "react-i18next";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const {t} = useTranslation();
  return (
    <Template noWrap={true} title={t("Sign Up title")}>
      <div id={"common-field"} className={"m-3 mt-5 width-30"}>
        <h1 className={"text-center"}>{t("Sign Up title")}</h1>
        <Formik
          validationSchema={yup.object().shape({
            username: yup.string().required(),
            password: yup.string().required().min(8),
            fullName: yup.string(),
          })}
          onSubmit={(values, formikHelpers) => {
            fetchSignUp(values).then(() => {
              window.location.href = UrlsFront.HOME;
            }).catch(() => {
              formikHelpers.setSubmitting(false);
              formikHelpers.setFieldError("username", "User already exists");
            });
          }}
          initialValues={{
            username: "",
            password: "",
            fullName: "",
          }}
          // validateOnChange={false}
          // validateOnBlur={false}
        >
          {({handleSubmit, handleBlur, handleChange, errors}) => (
            <Form noValidate onSubmit={handleSubmit} className={"d-flex flex-column gap-3"}>
              <Form.Group controlId="validationFormikUsername">
                <Form.Label>{t("Username")}</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="username"
                    name="username"
                    autoComplete={"username"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="validationFormikPassword">
                <Form.Label>{t("Password")}</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    name="password"
                    autoComplete={"new-password"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.password}
                  />
                  <Button variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          className={"d-flex align-items-center border-secondary-subtle"}>
                    {showPassword ? <BsEyeSlash/> : <BsEye/>}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Button className={"mt-3"} size={"lg"} type="submit">{t("Sign Up")}</Button>
            </Form>
          )}
        </Formik>
      </div>
    </Template>
  );
}
