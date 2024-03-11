import Template from "../Template.tsx";
import {useParams} from "react-router-dom";
import {deleteRepayment, updateRepayment} from "../../fetches.tsx";
import NotFound from "../NotFound.tsx";
import {Button, Card, Form, InputGroup} from "react-bootstrap";
import {BsArrowLeft, BsArrowRightCircle} from "react-icons/bs";
import {UserAvatar} from "../user/UserAvatar.tsx";
import {useEvent} from "./UseEvent.tsx";
import {BANK_FORMAT} from "../../constants.ts";
import * as yup from "yup";
import {Formik} from "formik";
import {useContext} from "react";
import {AuthContext} from "../../contexts/authContext.tsx";
import moment from "moment";

export default function Repayment() {
  const user = useContext(AuthContext)
  const {event, is404} = useEvent()
  const params = useParams<{ repaymentId: string }>()
  if (!event) {
    return is404 ? <NotFound/> : <Template/>;
  }
  const repayment = event.repayments.find(value => value.id == params.repaymentId!)
  if (!repayment) {
    return <NotFound/>
  }
  const isUser = user?.equals(repayment.payer) || false  //  || user?.equals(event.host)
  const usersNotMe = event.users.filter((value => !user?.equals(value)))

  return (
    <Template title={repayment.description}>
      <div className={"d-flex flex-column gap-3"}>
        {/* Event member header */}
        <Card>
          <Card.Body className={"d-flex align-items-center px-3 py-2 gap-3"}>
            <Button variant={"outline-secondary border-0"}
                    onClick={() => history.back()}>
              <BsArrowLeft size={"2rem"}/>
            </Button>
            <div
              className={"d-flex flex-row gap-2 justify-content-between align-items-center w-50 border-end pe-3"}>
              <UserAvatar user={repayment.payer} round={true} size={"3rem"}/>
              <BsArrowRightCircle size={"1.5rem"}/>
              <UserAvatar user={repayment.recipient} round={true} size={"3rem"}
                          className={"me-1"}/>
              <div className={"d-flex flex-column justify-content-between flex-grow-1"}>
                    <span className={"fs-5"}>
                      {repayment.description}
                    </span>
                <span className={"fs-6 text-muted"}>
                      {repayment.payedAt.toLocaleString()}
                    </span>
              </div>
              <span className={"fs-3"}>
                    {BANK_FORMAT.format(repayment.value)}
                  </span>
            </div>
            <div>
              <Card.Title>
                {event.name}
              </Card.Title>
              <Card.Subtitle className={"text-muted text-end"}>
                {event.description}
              </Card.Subtitle>
            </div>
          </Card.Body>
        </Card>

        <h3>General</h3>
        <Formik
          validationSchema={yup.object().shape({
            value: yup.number().positive().required(),
            description: yup.string(),
          })}
          onSubmit={(values) => {
            updateRepayment(values, event, repayment).then(() => {
              window.location.reload();
            })
          }}
          initialValues={{
            value: repayment.value,
            description: repayment.description,
            type: "to",
            user: usersNotMe[0]?.username,
            payedAt: moment(repayment.payedAt).format('YYYY-MM-DD[T]HH:mm'),
          }}
        >
          {({handleSubmit, handleChange, handleReset, values, errors}) => (
            <Form noValidate onSubmit={handleSubmit} className={"d-flex flex-column gap-3 w-50"}>
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
                    disabled={!isUser}
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
                    disabled={!isUser}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <div className={"d-flex gap-4"}>
                <Form.Group controlId="validationFormicType">
                  <Form.Label>Transaction</Form.Label>
                  <Form.Select name={"type"} value={values.type} onChange={handleChange}
                               disabled={true}
                               isInvalid={!!errors.type}>
                    <option value={"to"}>To</option>
                    {/*<option value={"from"}>From</option>*/}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.type}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="validationFormicUser" className={"flex-grow-1"}>
                  <Form.Label>User</Form.Label>
                  <Form.Select name={"user"} value={values.user} onChange={handleChange}
                               isInvalid={!!errors.user} disabled={true}>
                    {usersNotMe.map(user => (
                      <option value={user.username} key={user.username}>
                        {`@${user.username}${user.fullName == "" ? "" : ` (${user.fullName})`}`}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.user}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
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
                    disabled={true}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.payedAt}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <div className={"d-flex flex-row gap-3"}>
                <Button variant={"outline-secondary"} onClick={handleReset}
                        disabled={!isUser}>Reset</Button>
                <Button variant="primary" type="submit" disabled={!isUser}>Update deposit</Button>
              </div>
              <div>
                <Button variant={"danger"} disabled={!isUser} onClick={() => {
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
