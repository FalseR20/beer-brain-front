import Template from "../Template.tsx";
import {useParams} from "react-router-dom";
import {deleteRepayment, updateRepayment} from "../../fetches.tsx";
import NotFound from "../NotFound.tsx";
import {Button, Card, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {BsArrowDownCircle, BsArrowLeft, BsArrowRightCircle} from "react-icons/bs";
import {useEvent} from "./UseEvent.tsx";
import {BANK_FORMAT} from "../../constants.ts";
import * as yup from "yup";
import {Formik} from "formik";
import {useContext, useState} from "react";
import {AuthContext} from "../../contexts/authContext.tsx";
import moment from "moment";
import {UserTemplate} from "../user/User.tsx";
import {CRepayment} from "../../dataclasses.ts";

export default function Repayment() {
  const user = useContext(AuthContext)
  const {event, is404} = useEvent()
  const [repayment, setRepayment] = useState<CRepayment>()
  const params = useParams<{ repaymentId: string }>()
  if (!event) {
    return is404 ? <NotFound/> : <Template/>;
  }
  if (!repayment) {
    setRepayment(event.repayments.find(value => value.id == params.repaymentId!))
  }
  if (!repayment) {
    return <NotFound/>
  }
  const hasRights = user?.equals(repayment.payer) || user?.equals(event.host) || false

  return (
    <Template title={repayment.description}>
      <div className={"d-flex flex-column gap-3"}>
        {/* Event member header */}
        <Card>
          <Card.Body>
            <Container fluid={true}>
              <Row className={"align-items-center gap-3"}>
                <Col xs={{span: "auto", order: 1}} md={{span: "auto", order: 1}} className={"p-0"}>
                  <Button variant={"outline-secondary border-0"} onClick={() => history.back()}>
                    <BsArrowLeft size={"2rem"}/>
                  </Button>
                </Col>
                <Col xs={{span: false, order: 3}} md={{span: true, order: 2}}>
                  <Row className={"flex-md-nowrap gap-2 align-items-center"}>
                    <Col xs={true} sm={"auto"}>
                      <Row className={"align-items-center gap-2"}>
                        <Col sm={"auto"} className={"p-0"}>
                          <UserTemplate user={repayment.payer} size={"3rem"}/>
                        </Col>
                        {/* Arrow down if sm and left if more */}
                        <Col sm={"auto"} className={"p-0 d-sm-none"}>
                          <BsArrowDownCircle size={"1.7rem"} style={{marginLeft: "0.65rem"}}/>
                        </Col>
                        <Col sm={"auto"} className={"p-0 d-none d-sm-block"}>
                          <BsArrowRightCircle size={"1.7rem"} style={{marginLeft: "0.65rem"}}/>
                        </Col>
                        <Col sm={"auto"} className={"p-0 "}>
                          <UserTemplate user={repayment.recipient} size={"3rem"}/>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={3} sm={true} className={"p-0 ms-auto me-md-auto text-center"}>
                    <span className={"fs-3"}>
                      {BANK_FORMAT.format(repayment.value)}
                    </span>
                    </Col>
                  </Row>
                </Col>
                <Col xs={{span: true, order: 2}} md={{span: "auto", order: 3}}
                     className={"p-0 text-md-end"}>
                  <div className={"d-flex flex-column justify-content-between flex-grow-1 ms-2"}>
                  <span className={"fs-5"}>
                    {repayment.description}
                  </span>
                    <span className={"fs-6 text-muted"}>
                    {repayment.payedAt.toLocaleString()}
                  </span>
                  </div>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>

        <h3>General</h3>
        <Formik
          validationSchema={yup.object().shape({
            value: yup.number().positive().required(),
            description: yup.string(),
          })}
          onSubmit={(values) => {
            updateRepayment(values, event, repayment).then(setRepayment)
          }}
          initialValues={{
            value: repayment.value,
            description: repayment.description,
            payedAt: moment(repayment.payedAt).format('YYYY-MM-DD[T]HH:mm'),
          }}
        >
          {({handleSubmit, handleChange, handleReset, values, errors}) => (
            <Form noValidate onSubmit={handleSubmit}
                  className={"d-flex flex-column gap-3"} style={{maxWidth: "30rem"}}>
              <Form.Group controlId="validationFormikValue">
                <Form.Label>Value</Form.Label>
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
                    disabled={!hasRights}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.value}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="validationFormikDescription">
                <Form.Label>Description</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Beer and crisps"
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
                <Form.Label>Datetime</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="datetime-local"
                    aria-describedby="inputGroupPrepend"
                    name="payedAt"
                    value={values.payedAt}
                    onChange={handleChange}
                    isInvalid={!!errors.payedAt}
                    disabled={!user}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.payedAt}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <div className={"d-flex flex-row gap-3"}>
                <Button variant={"outline-secondary"} onClick={handleReset}
                        disabled={!hasRights}>Reset</Button>
                <Button variant="primary" type="submit" disabled={!hasRights}>Update
                  deposit</Button>
              </div>
              <div>
                <Button variant={"danger"} disabled={!hasRights} onClick={() => {
                  deleteRepayment(event.id, repayment.id).then(() => {
                    history.back()
                  })
                }}>Delete deposit</Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Template>
  )
}
