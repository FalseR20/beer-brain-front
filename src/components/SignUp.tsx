import Template from "./Template.tsx";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {fetchSignUp} from "../fetches.tsx";

export default function SignIn() {
  return (
    <Template>
      <div id={"form-back"}>
        <h1> Sign Up</h1>
        <Formik
          validationSchema={yup.object().shape({
            username: yup.string().required(),
            password: yup.string().required().min(8),
            passwordConfirmation: yup
              .string()
              .required()
              .oneOf([yup.ref("password")]),
          })}
          onSubmit={(values, formikHelpers) => {
            console.log(values);
            fetchSignUp(
              values.username,
              values.password,
            ).then(() => {
              window.location.href = "/";
            }).catch(() => {
              formikHelpers.setSubmitting(false);
              formikHelpers.setFieldError("username", "User already exists");
            });
          }}
          initialValues={{
            username: "",
            password: "",
            passwordConfirmation: "",
          }}
          // validateOnChange={false}
          // validateOnBlur={false}
        >
          {({handleSubmit, handleBlur, handleChange, errors}) => (
            <Form noValidate onSubmit={handleSubmit}>
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
              <Row>
                <Col>
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
                </Col>
                <Col>
                  <Form.Group controlId="validationFormikPasswordConfirmation">
                    <Form.Label>Password confirmation</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="password"
                        placeholder="Repeat password"
                        aria-describedby="inputGroupPrepend"
                        name="passwordConfirmation"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.passwordConfirmation}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.passwordConfirmation}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit">Submit</Button>
            </Form>
          )}
        </Formik>
      </div>
    </Template>
  );
}
