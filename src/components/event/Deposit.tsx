import Template from "../Template.tsx";
import {useParams} from "react-router-dom";
import {deleteDeposit, getDeposit, redirectGuest, updateDeposit} from "../../fetches.tsx";
import NotFound from "../NotFound.tsx";
import {Button, Card, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {BsArrowLeft} from "react-icons/bs";
import {BANK_FORMAT} from "../../constants.ts";
import * as yup from "yup";
import {Formik} from "formik";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/authContext.tsx";
import moment from "moment";
import {CDeposit} from "../../dataclasses.ts";
import {FetchError} from "../../errors.ts";
import {UserTemplate} from "../user/User.tsx";
import {useTranslation} from "react-i18next";

export default function Deposit() {
  const {t} = useTranslation();
  const [deposit, setDeposit] = useState<CDeposit>()
  const [is404, setIs404] = useState<boolean>(false)
  const user = useContext(AuthContext)
  const params = useParams<{ eventId: string, depositId: string }>();
  useEffect(() => {
    getDeposit(params.eventId!, params.depositId!)
      .then(setDeposit)
      .catch((error: FetchError) => {
        redirectGuest(error)
        setIs404(true)
      })
  }, [params.depositId, params.eventId]);

  if (!deposit) {
    return is404 ? <NotFound/> : <Template/>;
  }
  const isUser = user?.equals(deposit.user) || false  //  || user?.equals(event.host)

  return (
    <Template title={deposit.description}>
      <div className={"d-flex flex-column gap-3"}>
        <Card>
          <Card.Body>
            <Container fluid={true}>
              <Row className={"align-items-center gap-3"}>
                <Col xs={{span: "auto", order: 1}} md={{span: "auto", order: 1}} className={"p-0"}>
                  <Button variant={"outline-secondary border-0"}
                          onClick={() => history.back()}>
                    <BsArrowLeft size={"2rem"}/>
                  </Button>
                </Col>
                <Col xs={{span: false, order: 3}} md={{span: true, order: 2}}>
                  <Row className={"align-items-center flex-md-nowrap gap-2"}>
                    <Col xs={"auto"} className={"p-0"}>
                      <UserTemplate user={deposit.user} size={"3rem"}/>
                    </Col>
                    <Col xs={"auto"} className={"p-0 ms-auto me-md-auto"}>
                      <span className={"fs-3"}>
                    {BANK_FORMAT.format(deposit.value)}
                  </span>
                    </Col>
                  </Row>
                </Col>
                <Col xs={{span: true, order: 2}} md={{span: "auto", order: 3}}
                     className={"p-0 text-md-end"}>
                  <div className={"d-flex flex-column justify-content-between flex-grow-1"}>
                    <span className={"fs-5"}>
                      {deposit.description}
                    </span>
                    <span className={"fs-6 text-muted"}>
                      {deposit.payedAt.toLocaleString()}
                    </span>
                  </div>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>

        <h3>{t("Settings")}</h3>
        <Formik
          validationSchema={yup.object().shape({
            value: yup.number().positive().required(),
            description: yup.string(),
          })}
          onSubmit={(values) => {
            updateDeposit(values, params.eventId!, deposit).then(setDeposit)
          }}
          initialValues={{
            value: deposit.value,
            description: deposit.description,
            payedAt: moment(deposit.payedAt).format('YYYY-MM-DD[T]HH:mm'),
          }}
        >
          {({handleSubmit, handleChange, handleReset, values, errors}) => (
            <Form noValidate onSubmit={handleSubmit}
                  className={"d-flex flex-column gap-3"} style={{maxWidth: "30rem"}}>
              <Form.Group controlId="validationFormikValue">
                <Form.Label>{t("Value")}</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="7.62"
                    inputMode={"numeric"}
                    aria-describedby="inputGroupPrepend"
                    name="value"
                    value={values.value}
                    onChange={handleChange}
                    isInvalid={!!errors.value}
                    disabled={!isUser}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.value}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="validationFormikDescription">
                <Form.Label>{t("Description")}</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Beer and crisps"
                    aria-describedby="inputGroupPrepend"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                    disabled={!isUser}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="validationFormikDescription">
                <Form.Label>{t("Datetime")}</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="datetime-local"
                    aria-describedby="inputGroupPrepend"
                    name="payedAt"
                    value={values.payedAt}
                    onChange={handleChange}
                    isInvalid={!!errors.payedAt}
                    disabled={!isUser}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.payedAt}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <div className={"d-flex flex-row gap-3"}>
                <Button variant={"outline-secondary"} onClick={handleReset}
                        disabled={!isUser}>{t("Reset")}</Button>
                <Button variant="primary" type="submit" disabled={!isUser}>{t("Update deposit")}</Button>
              </div>
              <div>
                <Button variant={"danger"} disabled={!isUser} onClick={() => {
                  deleteDeposit(params.eventId!, deposit.id).then(() => {
                    history.back()
                  })
                }}>{t("Delete deposit")}</Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Template>
  )
}
