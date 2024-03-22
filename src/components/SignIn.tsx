import {Button, Form, InputGroup} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {fetchSignIn} from "../fetches.tsx";
import {UrlsFront} from "../urls.ts";
import {BsEye, BsEyeSlash} from "react-icons/bs";
import {lazy, useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/authContext.tsx";

const Template = lazy(() => import("./template/Template.tsx"))


export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const {updateUser} = useContext(AuthContext)
  const navigate = useNavigate();
  const {t} = useTranslation();
  return (
    <Template noWrap={true} title={t("Sign In title")}>
      <div id={"common-field"} className={"m-3 mt-5 width-30"}>
        <h1 className={"text-center"}>{t("Sign In")}</h1>
        <Formik
          validationSchema={yup.object().shape({
            username: yup.string().required(),
            password: yup.string().required(),
          })}
          onSubmit={(values, formikHelpers) => {
            fetchSignIn(values).then(() => {
              updateUser()
              navigate(UrlsFront.HOME);
            }).catch(() => {
              formikHelpers.setSubmitting(false);
              const message = "Wrong password or login";
              formikHelpers.setFieldError("username", message);
              formikHelpers.setFieldError("password", message);
            });
          }}
          initialValues={{
            username: "",
            password: "",
          }}
        >
          {({handleSubmit, handleChange, values, errors}) => (
            <Form noValidate onSubmit={handleSubmit} className={"d-flex flex-column gap-3"}>
              <Form.Group controlId="validationFormikUsername">
                <Form.Label>{t("Username")}</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    autoComplete="username"
                    value={values.username}
                    onChange={handleChange}
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
                    placeholder="Password"
                    aria-describedby="inputGroupPrepend"
                    name="password"
                    autoComplete={"current-password"}
                    value={values.password}
                    onChange={handleChange}
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
              <Button className={"mt-3"} size={"lg"} type="submit">{t("Sign In")}</Button>
            </Form>
          )}
        </Formik>
      </div>
    </Template>
  );
}
