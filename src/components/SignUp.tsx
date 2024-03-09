import Template from "./Template.tsx";
import {Button, Form, InputGroup} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {fetchSignUp} from "../fetches.tsx";
import {UrlsFront} from "../urls.ts";

export default function SignIn() {
  return (
    <Template noWrap={true} title={"Sign Up"}>
      <div id={"common-field"} className={"m-3 mt-5 width-30"}>
        <h1 className={"text-center"}> Sign Up</h1>
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
                <Form.Label>Username</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend"
                    name="username"
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
                <Form.Label>Password</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    aria-describedby="inputGroupPrepend"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="validationFormikFullname">
                <Form.Label>Full name (optional)</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="CuCum Bear"
                    aria-describedby="inputGroupPrepend"
                    name="fullName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Button className={"mt-3"} size={"lg"} type="submit">Register</Button>
            </Form>
          )}
        </Formik>
      </div>
    </Template>
  );
}
