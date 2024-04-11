import {useParams} from "react-router-dom";
import {deleteDeposit, updateDeposit} from "../../fetches.tsx";
import {Button, Card, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {BsArrowLeft} from "react-icons/bs";
import {BANK_FORMAT} from "../../constants.ts";
import * as yup from "yup";
import {Formik} from "formik";
import {lazy, useContext, useState} from "react";
import {AuthContext} from "../../contexts/authContext.tsx";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {useEvent} from "./UseEvent.tsx";
import {CDeposit} from "../../dataclasses.ts";

const NotFound = lazy(() => import("../NotFound.tsx"))
const UserTemplate = lazy(() => import("../user/UserTemplate.tsx"))
const Template = lazy(() => import("../template/Template.tsx"))

export default function Deposit() {
  const {t} = useTranslation();
  const {user} = useContext(AuthContext)
  const params = useParams<{ eventId: string, depositId: string }>();
  const {event, is404} = useEvent()
  const [deposit, setDeposit] = useState<CDeposit>()
  if (!event) {
    return is404 ? <NotFound/> : <Template/>;
  }
  if (!deposit) {
    const newDeposit = event.deposits.find(value => value.id == params.depositId!)
    if (newDeposit) {
      setDeposit(newDeposit)
    }
    return <NotFound/>
  }

  const hasRights = user?.equals(event.host) || user?.equals(deposit.user) || false

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
            value: yup.number().positive().lessThan(1e10).required(),
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
                    inputMode={"numeric"}
                    aria-describedby="inputGroupPrepend"
                    name="value"
                    value={values.value}
                    onChange={handleChange}
                    isInvalid={!!errors.value}
                    disabled={!hasRights}
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
                    aria-describedby="inputGroupPrepend"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                    disabled={!hasRights}
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
                    disabled={!hasRights}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.payedAt}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <div className={"d-flex flex-row gap-3"}>
                <Button variant={"outline-secondary"} onClick={handleReset}
                        disabled={!hasRights}>{t("Reset")}</Button>
                <Button variant="primary" type="submit"
                        disabled={!hasRights}>{t("Update deposit")}</Button>
              </div>
              <div>
                <Button variant={"danger"} disabled={!hasRights} onClick={() => {
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
