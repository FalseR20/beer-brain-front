import Template from "./Template.tsx";
import {Button, Form, InputGroup} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {fetchSignIn} from "../fetches.tsx";
import {UrlsFront} from "../urls.ts";

export default function SignIn() {
  return (
    <Template noWrap={true} title={"Sign In"}>
      <div id={"common-field"} className={"m-3 mt-5 width-30"}>
        <h1 className={"text-center"}> Sign In</h1>
        <Formik
          validationSchema={yup.object().shape({
            username: yup.string().required(),
            password: yup.string().required(),
          })}
          onSubmit={(values, formikHelpers) => {
            fetchSignIn(values).then(() => {
              window.location.href = UrlsFront.HOME;
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
                <Form.Label>Username</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend"
                    name="username"
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
                <Form.Label>Password</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    aria-describedby="inputGroupPrepend"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Button className={"mt-3"} size={"lg"} type="submit">Login</Button>
            </Form>
          )}
        </Formik>
      </div>
    </Template>
  );
}
